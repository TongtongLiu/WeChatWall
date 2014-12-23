#-*- coding:utf-8 -*-

WEIXIN_TOKEN = 'F8ZFW1Cyzr5z6nNoJ5uZhA8iXEbe1hvX'

WEIXIN_APPID = 'wxee3650a4c4fc6718'

WEIXIN_SECRET = '692211561b14daae68a8cee4310db019'

WEIXIN_EVENT_KEYS = {
    'info_activity': 'V1001_TODAT_ACTIVE',
    'info_lecture': 'V1001_TODAT_LECTURE',
    'info_news': 'V1001_SCHOOL_NEWS',
    'info_organization': 'V1001_OGNIZATION',
    'ticket_book_what': 'TSINGHUA_BOOK_WHAT',
    'ticket_get': 'TSINGHUA_TICKET',
    'account_bind': 'TSINGHUA_BIND',
    'help': 'TSINGHUA_HELP',
    'ticket_no_book_recommand': 'TSINGHUA_NO_BOOK_ACTS',
    'ticket_book_header': 'TSINGHUA_BOOK_',
    'modern_figure': 'V1001_MODERN_FIGURE',
}

WEIXIN_USERCENTER_URL = "http://wx2.igeek.asia/u/uc_center"

WEIXIN_OAUTH2_URL = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+WEIXIN_APPID+\
                        "&redirect_uri="+WEIXIN_USERCENTER_URL+\
                        "&response_type=code&scope=snsapi_base&state=0#wechat_redirect"

WEIXIN_CUSTOM_MENU_TEMPLATE = {
    "button": [
        {
            "name": "资讯",
            "sub_button": [
                {
                    "type": "click",
                    "name": "文艺",
                    "key": WEIXIN_EVENT_KEYS['info_activity'],
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "讲座",
                    "key": WEIXIN_EVENT_KEYS['info_lecture'],
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "新闻",
                    "key": WEIXIN_EVENT_KEYS['info_news'],
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "人物",
                    "key": WEIXIN_EVENT_KEYS['modern_figure'],
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "社团",
                    "key": WEIXIN_EVENT_KEYS['info_organization'],
                    "sub_button": []
                }
            ]
        },
		{
            "name": "服务",
            "sub_button": [
                {
                    "type": "click",
                    "name": "活动中心",
                    "key": WEIXIN_EVENT_KEYS['ticket_book_what'],
                    "sub_button": []
                },
                {
                    "type": "view",
                    "name": "个人中心",
                    "url": WEIXIN_OAUTH2_URL
                },
                {
                    "type": "view",
                    "name": "我要上墙",
                    "url": WEIXIN_OAUTH2_URL
                },
                #{
                #    "type": "click",
                #    "name": "查票",
                #    "key": WEIXIN_EVENT_KEYS['ticket_get'],
                #    "sub_button": []
                #},
                #{
                #    "type": "click",
                #    "name": "指路",
                #    "key": "TSINGHUA_PATH",
                #    "sub_button": []
                #},
                #{
                #    "type": "click",
                #    "name": "绑定",
                #    "key": WEIXIN_EVENT_KEYS['account_bind'],
                #    "sub_button": []
                #},
                {
                    "type": "click",
                    "name": "帮助",
                    "key": WEIXIN_EVENT_KEYS['help'],
                    "sub_button": []
                }
            ]
        },
        {
            "name": "抢票",
            "sub_button": []
        }
    ]
}

WEIXIN_BOOK_HEADER = 'TSINGHUA_BOOK_'


def get_custom_menu_with_book_acts(actbtns):
    tmpmenu = WEIXIN_CUSTOM_MENU_TEMPLATE.copy()
    book_btn = tmpmenu['button'][2]
    if len(actbtns) == 0:
        book_btn['type'] = 'click'
        book_btn['key'] = WEIXIN_EVENT_KEYS['ticket_no_book_recommand']
    book_btn['sub_button'] = actbtns
    return tmpmenu

