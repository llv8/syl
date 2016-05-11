# -*- coding: utf-8 -*-

from email.header import Header
from email.mime.text import MIMEText
import smtplib


def sendVCode(to_addr):
    from_addr = "system@post.siyuel.com"
    password = "lvwen2046821118"
    to_addr = "787365902@qq.com"
    smtp_server = "smtpdm.aliyun.com"
    content = '''
    
    '''
    msg = MIMEText('测试邮件内容', 'plain', 'utf-8')
    msg['From'] = from_addr
    msg['To'] = to_addr
    msg['Subject'] = Header(u'测试邮件', 'utf-8').encode()
    
    server = smtplib.SMTP(smtp_server, 25)
    server.set_debuglevel(1)
    server.login(from_addr, password)
    server.sendmail(from_addr, [to_addr,'venlv2046@gmail.com'], msg.as_string())
    server.quit()

sendVCode('aaa')