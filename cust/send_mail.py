# -*- coding: utf-8 -*-

from email.header import Header
from email.mime.text import MIMEText
import logging
import smtplib


# logger = logging.getLogger(__name__)
def send_vcode(to_addr, username, vcode):
    from_addr = "system@post.siyuel.com"
    password = "lvwen2046821118"
    smtp_server = "smtpdm.aliyun.com"
    content = '''
    您好{username}:您的验证码是{vcode},有效时长为60分钟。在浏览器中使用命令"vcode"验证。
    '''.format(username=username, vcode=vcode)
    msg = MIMEText(content, 'plain', 'utf-8')
    msg['From'] = from_addr
    msg['To'] = to_addr
    msg['Subject'] = Header(u'siyuel验证码', 'utf-8').encode()
    
    server = smtplib.SMTP(smtp_server, 25)
    try:
        server.login(from_addr, password)
        server.sendmail(from_addr, [to_addr], msg.as_string())
        return True
    except Exception as e:
        # logger.error(e)
        print(e)
        return False
    finally:
        server.quit()
    



