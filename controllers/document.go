package controllers

import (
	"github.com/gorilla/mux"
	"net/http"

	"io/ioutil"

	"appengine"

	"handler"
	"models"

	"appengine/urlfetch"
	"encoding/base64"
	"golang.org/x/net/context"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/cloud"
	"google.golang.org/cloud/storage"
	"mime/multipart"
	"time"
)

// Operations about Documents
type DocumentController struct {
}

func (controller *DocumentController) RegisterHandlers(r *mux.Router) {
	r.Handle("/document/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Get)).Methods("GET")
	r.Handle("/document/file/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.GetFile)).Methods("GET")
	r.Handle("/document", handler.New(controller.Upload)).Methods("POST")
	r.Handle("/document/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Delete)).Methods("DELETE")
}

// @Title Get
// @Description get document by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Document
// @Failure 403 :uid is empty
// @router /:uid [get]
func (controller *DocumentController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	document, err := models.GetDocument(uid)
	if err != nil {
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}
	return document, nil

}

// @Title Get
// @Description get document file encode in base64
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Document
// @Failure 403 :uid is empty
// @router /file/:uid [get]
func (controller *DocumentController) GetFile(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	document, err := models.GetDocument(uid)
	if err != nil {
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}
	dm := GetDocumentManager(request)
	data := dm.readFile(document.FilePath + document.Id)
	return map[string]string{"data": base64.URLEncoding.EncodeToString(data)}, nil
}

// @Title createDocument
// @Description create documents
// @Param	body		body 	models.Document	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router / [post]
func (controller *DocumentController) Upload(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	err := request.ParseMultipartForm(100000)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return nil, nil
	}

	//get a ref to the parsed multipart form
	dataForm := request.MultipartForm
	nameId := ""
	if nameIdP, ok := dataForm.Value["type"]; ok {
		nameId = nameIdP[0]
	} else {
		return nil, &handler.Error{nil, "Type of document not found and is required", http.StatusInternalServerError}
	}
	documentType, err := models.GetDocumentTypeByNameId(nameId)
	if err != nil {
		return nil, &handler.Error{err, "Wrong Document Type - " + nameId, http.StatusInternalServerError}
	}
	//get the *fileheaders
	files := dataForm.File["fileUpload"]
	if documents, ok := SaveDocumentsUploads(files, request, documentType); ok {
		return documents, nil
	} else {
		return nil, &handler.Error{err, "Error saving documents", http.StatusInternalServerError}
	}

}

// @Title delete
// @Description delete the Document
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (controller *DocumentController) Delete(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]
	document, err := models.GetDocument(uid)
	if err != nil {
		return nil, &handler.Error{err, "Entity not found.", http.StatusNoContent}
	}

	models.DeleteDocument(document)
	dm := GetDocumentManager(request)
	dm.deleteFile(document.FilePath + document.Id)

	return nil, nil
}

func GetDocumentManager(request *http.Request) *documentManager {
	context := appengine.NewContext(request)

	hc := &http.Client{
		Transport: &oauth2.Transport{
			Source: google.AppEngineTokenSource(context, storage.ScopeFullControl),
			Base:   &urlfetch.Transport{Context: context},
		},
	}
	ctx := cloud.NewContext(appengine.AppID(context), hc)

	return &documentManager{
		c:   context,
		ctx: ctx,
	}
}

func SaveDocumentsUploads(files []*multipart.FileHeader, request *http.Request, docType *models.DocumentType) ([]*models.Document, bool) {
	dm := GetDocumentManager(request)
	var documents []*models.Document

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	company := user.Company

	for i, _ := range files {
		//for each fileheader, get a handle to the actual file
		file, err := files[i].Open()
		defer file.Close()
		if err != nil {
			dm.errorf("createFile: unable to open file, file %q: %v", file, err)
			return documents, false
		}
		fileContents, err := ioutil.ReadAll(file)
		if err != nil {
			dm.errorf("createFile: unable to read file, file %q: %v", file, err)
			return documents, false
		}
		document := models.Document{
			Type:        docType,
			Creator:     user,
			Updater:     user,
			Authority:   user,
			Name:        files[i].Filename,
			Description: "",
			FilePath:    company.Id + "/" + docType.NameId + "/",
			FileName:    files[i].Filename,
			MimeType:    files[i].Header["Content-Type"][0],
			Date:        time.Now(),
			Company:     company,
		}

		models.AddDocument(&document)
		documents = append(documents, &document)

		dm.createFile(fileContents, document.FilePath+document.Id, document.MimeType)
	}
	return documents, true
}

//bucket name
var bucket = "sam-roster-bucket"

type documentManager struct {
	c   appengine.Context
	ctx context.Context
}

func (dm *documentManager) errorf(format string, args ...interface{}) {
	dm.c.Errorf(format, args...)
}

// createFile creates a file in Google Cloud Storage.
func (dm *documentManager) createFile(file []byte, fileName, contentType string) {

	wc := storage.NewWriter(dm.ctx, bucket, fileName)
	wc.ContentType = contentType
	if _, err := wc.Write(file); err != nil {
		dm.errorf("createFile: unable to write data to bucket %q, file %q: %v", bucket, file, err)
		return
	}

	if err := wc.Close(); err != nil {
		dm.errorf("createFile: unable to close bucket %q, file %q: %v", bucket, file, err)
		return
	}
}

// readFile reads the named file in Google Cloud Storage.
func (dm *documentManager) readFile(fileName string) []byte {
	rc, err := storage.NewReader(dm.ctx, bucket, fileName)
	if err != nil {
		dm.errorf("readFile: unable to open file from bucket %q, file %q: %v", bucket, fileName, err)
		return nil
	}
	defer rc.Close()
	fileContent, err := ioutil.ReadAll(rc)
	if err != nil {
		dm.errorf("readFile: unable to read data from bucket %q, file %q: %v", bucket, fileName, err)
		return nil
	}
	return fileContent
}

func (d *documentManager) deleteFile(fileName string) bool {
	if err := storage.DeleteObject(d.ctx, bucket, fileName); err != nil {
		d.errorf("deleteFiles: unable to delete bucket %q, file %q: %v", bucket, fileName, err)
		return false
	}
	return true
}
