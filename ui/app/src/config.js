'use strict';

angular.module('config',[]).constant('config', {
    application: {
        name:           'Inventory',
        id:             'Inventory',
        companyId:      '242495b7-69f4-4107-a4d8-850540e6b834',
        currency:       'USD',
        defaultTimezone:'America/New_York',
        limitInPage: 20
    },
    api: {
        baseUrl: 'http://192.168.1.100:9000'
    },
    date: {
        outputFormatDateTime: 'MMM D, YYYY[separator]HH:mm z',
        outputFormatDate: 'MMM D, YYYY',
        inputFormatDateTime: 'MMM D, YYYY HH:mm',
        inputFormatDate: 'MMM D, YYYY',
        isoFormat: 'YYYY-MM-DDTHH:mm:ss\Z'
    },
    menu: [
        {
            id: 'default',
            elements: [
                {
                    id:     'inventory',
                    state:  'app.inventory',
                    url:    '#/inventory',
                    title:  'Inventory',
                    icon:   'fa-plus-square'
                },
                {
                    id:     'admin',
                    state:  'admin',
                    url:    '#/admin/users',
                    title:  'Admin',
                    icon:   'fa-cog'
                }
            ],
            constraints: {
                states: [
                    'app.dashboard',
                    'app.clinic',
                    'app.inventory'
                ]
            },
            include: {
                modules:    false,
                cases:      false,
                chartLink:  false
            }
        },
        {
            id: 'admin',
            elements: [
                {
                    id:     'users',
                    state:  'app.users',
                    url:    '#/admin/users',
                    title:  'Users',
                    icon:   'fa fa-user'
                },
                {
                    id:     'group',
                    state:  'app.group',
                    url:    '#/admin/group',
                    title:  'Groups',
                    icon:   'fa fa-users'
                },
                {
                    id:     'admin-patient',
                    state:  'app.admin-patient',
                    url:    '#/admin/patients',
                    title:  'Patients',
                    icon:   'fa fa-user'
                }
            ],
            constraints: {
                states: [
                    'app.admin',
                    'app.users',
                    'app.group',
                    'app.admin-patient'
                ]
            },
            include: {
                modules:    false,
                cases:      false,
                chartLink:  false
            }
        }
    ],
    timezone: {
        'America/Porto_Acre': -14400, 'America/Eirunepe': -14400, 'America/Rio_Branco': -14400, 'Brazil/Acre' : -14400, 'America/Goose_Bay' : -7200, 'America/Pangnirtung' : -7200, 'Africa/Addis_Ababa' : 9320, 'Africa/Asmara' : 9320, 'Africa/Asmera' : 9320, 'America/Halifax' : -10800, 'America/Barbados' : -10800, 'America/Blanc-Sablon' : -10800, 'America/Glace_Bay' : -10800, 'America/Martinique' : -10800, 'America/Moncton' : -10800, 'America/Thule' : -10800, 'Atlantic/Bermuda' : -10800, 'Canada/Atlantic' : -10800, 'Asia/Baghdad' : 14400, 'Asia/Kabul' : 14400, 'America/Anchorage' : -32400, 'America/Adak' : -36000, 'America/Atka' : -36000, 'America/Juneau' : -28800, 'America/Nome' : -28800, 'America/Yakutat' : -28800, 'Asia/Aqtobe' : 21600, 'Asia/Almaty' : 25200, 'Asia/Yerevan' : 14400, 'America/Boa_Vista' : -10800, 'America/Campo_Grande' : -10800, 'America/Cuiaba' : -10800, 'America/Manaus' : -10800, 'America/Porto_Velho' : -10800, 'America/Santarem' : -10800, 'Brazil/West' : -10800, 'America/Asuncion' : -13840, 'Europe/Amsterdam' : 1172, 'Europe/Athens' : 5692, 'Asia/Anadyr' : 43200, 'America/Curacao' : -16200, 'America/Aruba' : -16200, 'Africa/Luanda' : 3124, 'America/Puerto_Rico' : -10800, 'Asia/Aqtau' : 18000, 'America/Buenos_Aires' : -10800, 'America/Argentina/Buenos_Aires' : -10800, 'America/Argentina/Catamarca' : -10800, 'America/Argentina/ComodRivadavia' : -10800, 'America/Argentina/Cordoba' : -10800, 'America/Argentina/Jujuy' : -10800, 'America/Argentina/La_Rioja' : -10800, 'America/Argentina/Mendoza' : -10800, 'America/Argentina/Rio_Gallegos' : -10800, 'America/Argentina/Salta' : -10800, 'America/Argentina/San_Juan' : -10800, 'America/Argentina/San_Luis' : -10800, 'America/Argentina/Tucuman' : -10800, 'America/Argentina/Ushuaia' : -10800, 'America/Catamarca' : -10800, 'America/Cordoba' : -10800, 'America/Jujuy' : -10800, 'America/Mendoza' : -10800, 'America/Rosario' : -10800, 'Antarctica/Palmer' : -10800, 'Asia/Ashkhabad' : 18000, 'Asia/Ashgabat' : 18000, 'Asia/Riyadh' : 10800, 'America/Anguilla' : -14400, 'America/Antigua' : -14400, 'America/Dominica' : -14400, 'America/Grenada' : -14400, 'America/Guadeloupe' : -14400, 'America/Marigot' : -14400, 'America/Miquelon' : -14400, 'America/Montserrat' : -14400, 'America/Port_of_Spain' : -14400, 'America/Santo_Domingo' : -14400, 'America/St_Barthelemy' : -14400, 'America/St_Kitts' : -14400, 'America/St_Lucia' : -14400, 'America/St_Thomas' : -14400, 'America/St_Vincent' : -14400, 'America/Tortola' : -14400, 'America/Virgin' : -14400, 'Asia/Aden' : 10800, 'Asia/Bahrain' : 10800, 'Asia/Kuwait' : 10800, 'Asia/Qatar' : 10800, 'Atlantic/Azores' : -3600, 'Asia/Baku' : 14400, 'Europe/London' : 7200, 'Asia/Dacca' : 25200, 'Asia/Dhaka' : 25200, 'Europe/Belfast' : 7200, 'Europe/Gibraltar' : 7200, 'Europe/Guernsey' : 7200, 'Europe/Isle_of_Man' : 7200, 'Europe/Jersey' : 7200, 'GB' : 7200, 'Africa/Mogadishu' : 9000, 'Africa/Kampala' : 9000, 'Africa/Nairobi' : 9000, 'Africa/Dar_es_Salaam' : 9885, 'America/Bogota' : -17780, 'Africa/Banjul' : -3996, 'Asia/Bangkok' : 24124, 'Europe/Tiraspol' : 6264, 'Europe/Bucharest' : 6264, 'Europe/Chisinau' : 6264, 'Asia/Brunei' : 27000, 'Asia/Kuching' : 30000, 'America/La_Paz' : -12756, 'America/Sao_Paulo' : -7200, 'America/Araguaina' : -7200, 'America/Bahia' : -7200, 'America/Belem' : -7200, 'America/Fortaleza' : -7200, 'America/Maceio' : -7200, 'America/Recife' : -7200, 'Brazil/East' : -7200, 'Pacific/Midway' : -39600, 'Pacific/Pago_Pago' : -39600, 'Pacific/Samoa' : -39600, 'Europe/Dublin' : 3600, 'Asia/Thimbu' : 21600, 'Asia/Thimphu' : 21600, 'Asia/Kolkata' : 23400, 'Asia/Calcutta' : 23400, 'Asia/Rangoon' : 23400, 'Atlantic/Canary' : -3600, 'Australia/Adelaide' : 34200, 'Africa/Gaborone' : 10800, 'Africa/Khartoum' : 10800, 'Antarctica/Casey' : 39600, 'Africa/Blantyre' : 7200, 'Africa/Bujumbura' : 7200, 'Africa/Harare' : 7200, 'Africa/Kigali' : 7200, 'Africa/Lubumbashi' : 7200, 'Africa/Lusaka' : 7200, 'Africa/Maputo' : 7200, 'Africa/Windhoek' : 7200, 'Indian/Cocos' : 23400, 'America/Rankin_Inlet' : -14400, 'America/Resolute' : -14400, 'America/Chicago' : -18000, 'America/Havana' : -14400, 'America/Atikokan' : -18000, 'America/Bahia_Banderas' : -18000, 'America/Belize' : -18000, 'America/Cambridge_Bay' : -18000, 'America/Cancun' : -18000, 'America/Chihuahua' : -18000, 'America/Coral_Harbour' : -18000, 'America/Costa_Rica' : -18000, 'America/El_Salvador' : -18000, 'America/Fort_Wayne' : -18000, 'America/Guatemala' : -18000, 'America/Indiana/Indianapolis' : -18000, 'America/Indiana/Knox' : -18000, 'America/Indiana/Marengo' : -18000, 'America/Indiana/Petersburg' : -18000, 'America/Indiana/Tell_City' : -18000, 'America/Indiana/Vevay' : -18000, 'America/Indiana/Vincennes' : -18000, 'America/Indiana/Winamac' : -18000, 'America/Indianapolis' : -18000, 'America/Iqaluit' : -18000, 'America/Kentucky/Louisville' : -18000, 'America/Kentucky/Monticello' : -18000, 'America/Knox_IN' : -18000, 'America/Louisville' : -18000, 'America/Managua' : -18000, 'America/Matamoros' : -18000, 'America/Menominee' : -18000, 'America/Merida' : -18000, 'America/Mexico_City' : -18000, 'America/Monterrey' : -18000, 'America/North_Dakota/Center' : -18000, 'America/North_Dakota/New_Salem' : -18000, 'America/Ojinaga' : -18000, 'America/Rainy_River' : -18000, 'America/Tegucigalpa' : -18000, 'America/Winnipeg' : -18000, 'Canada/Central' : -18000, 'Mexico/General' : -18000, 'Asia/Shanghai' : 32400, 'Asia/Chongqing' : 32400, 'Asia/Chungking' : 32400, 'Asia/Harbin' : 32400, 'Asia/Kashgar' : 32400, 'Asia/Taipei' : 32400, 'Asia/Urumqi' : 32400, 'PRC' : 32400, 'ROC' : 32400, 'Europe/Berlin' : 10800, 'CET' : 10800, 'Europe/Kaliningrad' : 10800, 'Africa/Algiers' : 7200, 'Africa/Ceuta' : 7200, 'Africa/Tripoli' : 7200, 'Africa/Tunis' : 7200, 'Arctic/Longyearbyen' : 7200, 'Atlantic/Jan_Mayen' : 7200, 'Europe/Andorra' : 7200, 'Europe/Belgrade' : 7200, 'Europe/Bratislava' : 7200, 'Europe/Brussels' : 7200, 'Europe/Budapest' : 7200, 'Europe/Copenhagen' : 7200, 'Europe/Kiev' : 7200, 'Europe/Lisbon' : 7200, 'Europe/Ljubljana' : 7200, 'Europe/Luxembourg' : 7200, 'Europe/Madrid' : 7200, 'Europe/Malta' : 7200, 'Europe/Minsk' : 7200, 'Europe/Monaco' : 7200, 'Europe/Oslo' : 7200, 'Europe/Paris' : 7200, 'Europe/Podgorica' : 7200, 'Europe/Prague' : 7200, 'Europe/Riga' : 7200, 'Europe/Rome' : 7200, 'Europe/San_Marino' : 7200, 'Europe/Sarajevo' : 7200, 'Europe/Simferopol' : 7200, 'Europe/Skopje' : 7200, 'Europe/Sofia' : 7200, 'Europe/Stockholm' : 7200, 'Europe/Tallinn' : 7200, 'Europe/Tirane' : 7200, 'Europe/Uzhgorod' : 7200, 'Europe/Vaduz' : 7200, 'Europe/Vatican' : 7200, 'Europe/Vienna' : 7200, 'Europe/Vilnius' : 7200, 'Europe/Warsaw' : 7200, 'Europe/Zagreb' : 7200, 'Europe/Zaporozhye' : 7200, 'Europe/Zurich' : 7200, 'WET' : 7200, 'Africa/Casablanca' : 3600, 'America/Scoresbysund' : -3600, 'Pacific/Chatham' : 49500, 'Asia/Choibalsan' : 36000, 'Pacific/Chuuk' : 36000, 'Pacific/Truk' : 36000, 'Pacific/Yap' : 36000, 'Asia/Dili' : 28800, 'Asia/Makassar' : 28800, 'Asia/Pontianak' : 28800, 'Asia/Ujung_Pandang' : 28800, 'Asia/Sakhalin' : 32400, 'Asia/Tokyo' : 32400, 'Pacific/Rarotonga' : -34200, 'America/Santiago' : -10800, 'Chile/Continental' : -10800, 'America/Caracas' : -16060, 'America/Panama' : -19176, 'America/Detroit' : -21600, 'America/Hermosillo' : -21600, 'America/Mazatlan' : -21600, 'America/Regina' : -21600, 'America/Swift_Current' : -21600, 'America/Thunder_Bay' : -21600, 'Canada/East-Saskatchewan' : -21600, 'Canada/Saskatchewan' : -21600, 'Mexico/BajaSur' : -21600, 'Asia/Macao' : 28800, 'Asia/Macau' : 28800, 'Asia/Jayapura' : 34200, 'Australia/Broken_Hill' : 34200, 'Australia/Darwin' : 34200, 'Australia/North' : 34200, 'Australia/South' : 34200, 'Australia/Yancowinna' : 34200, 'Atlantic/Cape_Verde' : -3600, 'Australia/Eucla' : 31500, 'Indian/Christmas' : 25200, 'Pacific/Guam' : 36000, 'Pacific/Saipan' : 36000, 'Antarctica/Davis' : 18000, 'Antarctica/DumontDUrville' : 36000, 'Asia/Dushanbe' : 21600, 'Chile/EasterIsland' : -18000, 'Pacific/Easter' : -18000, 'Indian/Antananarivo' : 14400, 'Africa/Djibouti' : 10800, 'Indian/Comoro' : 10800, 'Indian/Mayotte' : 10800, 'America/Guayaquil' : -18000, 'Pacific/Galapagos' : -18000, 'America/New_York' : -14400, 'America/Grand_Turk' : -14400, 'America/Jamaica' : -14400, 'America/Montreal' : -14400, 'America/Nassau' : -14400, 'America/Nipigon' : -14400, 'America/Port-au-Prince' : -14400, 'America/Toronto' : -14400, 'Canada/Eastern' : -14400, 'EST' : -14400, 'Europe/Helsinki' : 10800, 'Africa/Cairo' : 10800, 'Asia/Amman' : 10800, 'Asia/Beirut' : 10800, 'Asia/Damascus' : 10800, 'Asia/Gaza' : 10800, 'Asia/Istanbul' : 10800, 'Asia/Nicosia' : 10800, 'EET' : 10800, 'Europe/Istanbul' : 10800, 'Europe/Mariehamn' : 10800, 'Europe/Moscow' : 10800, 'Europe/Nicosia' : 10800, 'America/Cayman' : -18000, 'Antarctica/Macquarie' : 36000, 'Australia/ACT' : 36000, 'Australia/Brisbane' : 36000, 'Australia/Canberra' : 36000, 'Australia/Currie' : 36000, 'Australia/Hobart' : 36000, 'Australia/LHI' : 36000, 'Australia/Lindeman' : 36000, 'Australia/Lord_Howe' : 36000, 'Australia/Melbourne' : 36000, 'Australia/NSW' : 36000, 'Australia/Queensland' : 36000, 'Australia/Sydney' : 36000, 'Australia/Tasmania' : 36000, 'Australia/Victoria' : 36000, 'Pacific/Fiji' : 46800, 'Atlantic/Stanley' : -10800, 'Africa/Freetown' : -3180, 'Atlantic/Madeira' : -4056, 'America/Noronha' : -3600, 'Brazil/DeNoronha' : -3600, 'Asia/Bishkek' : 21600, 'Pacific/Gambier' : -32400, 'America/Guyana' : -13500, 'Asia/Tbilisi' : 14400, 'America/Cayenne' : -10800, 'Africa/Accra' : 1200, 'Pacific/Tarawa' : 43200, 'Africa/Abidjan' : -968, 'Africa/Bamako' : -1920, 'Africa/Bissau' : -3740, 'Africa/Conakry' : -3292, 'Africa/Dakar' : -4184, 'Africa/Lome' : 0, 'Africa/Malabo' : 2108, 'Africa/Monrovia' : -2670, 'Africa/Niamey' : 508, 'Africa/Nouakchott' : -3828, 'Africa/Ouagadougou' : -364, 'Africa/Porto-Novo' : 628, 'Africa/Sao_Tome' : -2192, 'Africa/Timbuktu' : -1920, 'America/Danmarkshavn' : -4480, 'Atlantic/Reykjavik' : -3600, 'Atlantic/St_Helena' : -1368, 'Etc/GMT' : 0, 'Etc/Greenwich' : 0, 'Asia/Dubai' : 14400, 'Atlantic/South_Georgia' : -7200, 'Asia/Muscat' : 14400, 'Pacific/Honolulu' : -34200, 'HST' : -34200, 'Asia/Hong_Kong' : 32400, 'Asia/Hovd' : 28800, 'Pacific/Johnston' : -36000, 'Asia/Ho_Chi_Minh' : 25200, 'Asia/Phnom_Penh' : 25200, 'Asia/Saigon' : 25200, 'Asia/Vientiane' : 25200, 'Asia/Jerusalem' : 14400, 'Asia/Tel_Aviv' : 14400, 'Asia/Colombo' : 21600, 'Asia/Irkutsk' : 25040, 'Indian/Chagos' : 18000, 'Asia/Tehran' : 16200, 'Asia/Karachi' : 19800, 'Asia/Kathmandu' : 19800, 'Asia/Katmandu' : 19800, 'Asia/Jakarta' : 26400, 'Asia/Kuala_Lumpur' : 32400, 'Asia/Manila' : 32400, 'Asia/Singapore' : 32400, 'Pacific/Nauru' : 32400, 'Asia/Seoul' : 32400, 'ROK' : 32400, 'Asia/Qyzylorda' : 21600, 'Pacific/Kosrae' : 39600, 'Asia/Krasnoyarsk' : 25200, 'Asia/Novokuznetsk' : 25200, 'Asia/Pyongyang' : 28800, 'Europe/Samara' : 10800, 'Pacific/Kwajalein' : -43200, 'Pacific/Kiritimati' : -36000, 'America/Godthab' : -12416, 'America/Paramaribo' : -13240, 'Atlantic/Faeroe' : -1624, 'Atlantic/Faroe' : -1624, 'America/Lima' : -18516, 'America/Edmonton' : -27232, 'Canada/Mountain' : -27232, 'America/Santa_Isabel' : -27568, 'America/Ensenada' : -28084, 'America/Tijuana' : -28084, 'Mexico/BajaNorte' : -28084, 'Africa/El_Aaiun' : -3168, 'Pacific/Marquesas' : -33480, 'Pacific/Tahiti' : -35896, 'Pacific/Apia' : -41216, 'Europe/Volgograd' : 10660, 'Asia/Oral' : 12324, 'Indian/Mahe' : 13308, 'Indian/Reunion' : 13312, 'Indian/Mauritius' : 13800, 'Asia/Yekaterinburg' : 14544, 'Asia/Samarkand' : 16032, 'Asia/Tashkent' : 16632, 'Asia/Omsk' : 17616, 'Asia/Novosibirsk' : 19900, 'Africa/Libreville' : 2268, 'Africa/Douala' : 2328, 'Asia/Ulaanbaatar' : 25652, 'Asia/Ulan_Bator' : 25652, 'Asia/Yakutsk' : 31120, 'Asia/Vladivostok' : 31664, 'Africa/Ndjamena' : 3612, 'Asia/Magadan' : 36192, 'Africa/Brazzaville' : 3668, 'Asia/Kamchatka' : 38076, 'Pacific/Guadalcanal' : 38388, 'Pacific/Noumea' : 39948, 'Pacific/Efate' : 40396, 'Africa/Bangui' : 4460, 'Africa/Maseru' : 6600, 'Africa/Mbabane' : 7464, 'Africa/Lagos' : 816, 'Antarctica/Mawson' : 18000, 'America/Yellowknife' : -18000, 'America/Denver' : -21600, 'America/Boise' : -21600, 'America/Inuvik' : -21600, 'America/Phoenix' : -21600, 'America/Shiprock' : -21600, 'MST' : -21600, 'MET' : 7200, 'Pacific/Majuro' : 39600, 'America/Montevideo' : -13484, 'Indian/Maldives' : 17640, 'America/Dawson_Creek' : -25200, 'America/St_Johns' : -5400, 'Canada/Newfoundland' : -5400, 'Pacific/Norfolk' : 41400, 'Pacific/Niue' : -39600, 'Pacific/Auckland' : 46800, 'Antarctica/McMurdo' : 46800, 'Antarctica/South_Pole' : 46800, 'NZ' : 46800, 'America/Los_Angeles' : -25200, 'America/Dawson' : -25200, 'America/Vancouver' : -25200, 'America/Whitehorse' : -25200, 'Canada/Pacific' : -25200, 'Canada/Yukon' : -25200, 'Pacific/Port_Moresby' : 36000, 'Pacific/Enderbury' : -39600, 'Pacific/Pitcairn' : -30600, 'Pacific/Pohnpei' : 39600, 'Pacific/Ponape' : 39600, 'Pacific/Palau' : 32400, 'Antarctica/Rothera' : -10800, 'Africa/Johannesburg' : 10800, 'Antarctica/Syowa' : 10800, 'Indian/Kerguelen' : 18000, 'Pacific/Fakaofo' : -36000, 'Pacific/Tongatapu' : 50400, 'Pacific/Funafuti' : 43200, 'Etc/UCT' : 0, 'UCT' : 0, 'Etc/Universal' : 0, 'Etc/UTC' : 0, 'Etc/Zulu' : 0, 'GMT' : 0, 'UTC' : 0, 'Antarctica/Vostok' : 21600, 'Pacific/Wake' : 43200, 'Africa/Kinshasa' : 3600, 'Pacific/Wallis' : 43200, 'Australia/Perth' : 28800, 'Australia/West' : 28800
    }
});