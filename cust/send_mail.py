# -*- coding: utf-8 -*-

from email.header import Header
from email.mime.text import MIMEText
import logging
import smtplib
import syl


def send_vcode(to_addr, username, vcode):
    logger = logging.getLogger(__name__)
    content = '''
    您好{username}:您的验证码是{vcode},有效时长为60分钟。在浏览器中使用命令"vcode"验证。
    '''.format(username=username, vcode=vcode)
    msg = MIMEText(content, 'plain', 'utf-8')
    msg['From'] = syl.settings.MAIL['from_addr']
    msg['To'] = to_addr
    msg['Subject'] = Header(u'siyuel验证码', 'utf-8').encode()
    
    server = smtplib.SMTP(syl.settings.MAIL['smtp_server'], 25)
    try:
        server.login(syl.settings.MAIL['from_addr'], syl.settings.MAIL['password'])
        server.sendmail(syl.settings.MAIL['from_addr'], [to_addr], msg.as_string())
        logger.info(to_addr + ' send mail success')
        return True
    except Exception as e:
        logger.error(e)
        return False
    finally:
        server.quit()
    



