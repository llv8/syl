from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
import simplejson

@ensure_csrf_cookie
def index(request):
    apps = ['chat.html', 'tech.html', 'qa.html', 'tools.html']

    return render(request, 'index.html', {'apps':apps})

def article():
    article_list = ARTICLES.split('\n')
    for article in article_list:
        if(article):
            a = simplejson.loads(article)
            print('<a href=' + a["url"] + '>' + a["text"] + '</a><br/>')

ARTICLES = '''
{"url": "http://www.spotty.com.cn/archives/57/", "text": "javascript\u6a21\u5757\u5316\u7f16\u7a0b(\u4e00)"}
{"url": "https://xituqu.com/212.html", "text": "\u8bbe\u8ba1\u5411 20+\u7cbe\u7f8e\u5b9e\u7528\u7684Sketch\u6a21\u677f"}
{"url": "http://www.chinarobots.cn/XingYeDongTai/729.html", "text": "\u804a\u5929\u673a\u5668\u4eba\u5982\u4f55\u76c8\u5229\uff1f\u8fd9\u91cc\u6709\u4e03\u79cd\u53ef\u80fd\u7684\u5546\u4e1a\u6a21\u5f0f"}
{"url": "http://www.chengxuyuan.com/post/500.html", "text": "\u8fd9\u4e9b\u5e74\u4f60\u8bfb\u8fc7\u7684\u4e66 /*\u76ae*/"}
{"url": "http://limboy.me/essay/2015/08/14/learning-how-to-learn.html?hmsr=toutiao.io&amp;utm_medium=toutiao.io&amp;utm_source=toutiao.io", "text": "\u5b66\u4e60\u5982\u4f55\u5b66\u4e60"}
{"url": "http://www.jianshu.com/p/49d7cbbf47fd?hmsr=toutiao.io&amp;utm_medium=toutiao.io&amp;utm_source=toutiao.io", "text": "\u4e3a\u4ec0\u4e48\u6211\u8981\u5199\u81ea\u5df1\u7684\u6846\u67b6\uff1f"}
{"url": "http://www.cnblogs.com/aoyeyuyan/p/5495219.html", "text": "\u90a3\u4e9b\u5e74\u641e\u4e0d\u61c2\u7684\u9ad8\u6df1\u672f\u8bed\u2014\u2014\u4f9d\u8d56\u5012\u7f6e\u2022\u63a7\u5236\u53cd\u8f6c\u2022\u4f9d\u8d56\u6ce8\u5165\u2022\u9762\u5411\u63a5\u53e3\u7f16\u7a0b"}
{"url": "http://netsmell.com/post/hawking-stephen-write-weibo.html?_biz=MjM5OTA1MDUyMA==&mid=407358558&idx=2&sn=b21877f23bf4063fa311185009c1f0b7&scene=0#wechat_redirect1465605382158", "text": "\u624b\u6307\u4e0d\u80fd\u52a8\u7684\u970d\u91d1\u539f\u6765\u662f\u8fd9\u4e48\u53d1\u5fae\u535a\u7684"}
{"url": "http://rsarxiv.github.io/2016/06/12/Gated-Attention-Readers-for-Text-Comprehension-PaperWeekly/", "text": "Gated-Attention Readers for Text Comprehension #PaperWeekly# | RSarXiv"}
{"url": "http://www.beforweb.com/node/833", "text": "\u5ff5\u53e8 - \u5173\u4e8e\u600e\u6837\u5b66\u4e60VR\u8bbe\u8ba1"}
{"url": "http://www.yunweipai.com/archives/7620.html", "text": "\u5168\u56fd\u4f4e\u4e8e30ms\u54cd\u5e94\u901f\u5ea6:\u5343\u4e07\u7ea7\u9b45\u65cf\u7528\u6237\u7684\u5f02\u5730\u591a\u70b9\u7f51\u7edc\u67b6\u6784\u5982\u4f55\u4f18\u5316"}
{"url": "http://www.techug.com/a-thread-say", "text": "\u4e00\u4e2a\u7ebf\u7a0b\u7684\u72ec\u767d"}
{"url": "http://geek.csdn.net/news/detail/79769", "text": "\u6d45\u8c08TCP/IP\u534f\u8bae\u6808(\u4e09)\u8def\u7531\u5668\u7b80\u4ecb"}
{"url": "http://www.techug.com/6-surprising-soft-skills-developers-use-every-day", "text": "\u7a0b\u5e8f\u5458\u5fc5\u987b\u638c\u63e1\u76846\u79cd\u8f6f\u6280\u80fd"}
{"url": "http://blog.csdn.net/ZSGG_ACM/article/details/51627712", "text": "\u6570\u5b66--\u6c42\u5e73\u9762\u4e0an\u4e2a\u70b9\u7ec4\u6210\u7684\u5e73\u884c\u56db\u8fb9\u5f62\u4e2a\u6570"}
{"url": "http://www.phpxs.com/post/5088", "text": "\u8c08\u8c08\u5728\u6821\u7a0b\u5e8f\u5458\u6280\u80fd\u57f9\u517b"}
{"url": "http://dbaplus.cn/news-21-463-1.html", "text": "\u6211\u662f\u5982\u4f55\u901a\u8fc75\u8f6e\u9762\u8bd5\u62ff\u4e0bFacebook offer\uff1f"}
{"url": "http://www.smartcitychina.cn/QianYanJiShu/2016-06/7262.html", "text": "\u8fd9\u5e94\u8be5\u662f\u8fc4\u4eca\u4e3a\u6b62\u6700\u5168\u7684\u4e00\u4efdJava\u5c31\u4e1a\u6307\u5bfc\u4e66"}
{"url": "http://geek.csdn.net/news/detail/79169", "text": "\u6570\u636e\u7ed3\u6784\u4e0e\u7b97\u6cd5\uff08\u4e00\uff09\u6982\u5ff5\u68b3\u7406\u7bc7"}
{"url": "http://www.58maisui.com/2016/06/10/a-134/", "text": "\u6709\u94b1\u4eba\u6709\u4ec0\u4e48\u7279\u70b9\uff1f \u2013 \u9ea6\u7a57\u6280\u672f"}
{"url": "http://www.techug.com/20-learn-programming-site", "text": "\u6e38\u620f\u4e2d\u5b66\u4f1a\u5199\u4ee3\u7801\uff1a\u8fd9\u4e9b\u7f16\u7a0b\u5b66\u4e60\u7f51\u7ad9\u4e0d\u5bb9\u9519\u8fc7"}
{"url": "http://blog.csdn.net/yuanziok/article/details/51593964", "text": "\u76d8\u70b9\uff1a2016\u4e2d\u56fd\u767e\u5f3a\u5730\u4ea7CIO\u9ad8\u5cf0\u8bba\u575b\u76848\u5927\u770b\u70b9"}
{"url": "http://www.58maisui.com/2016/06/07/a-111/", "text": "Get\u548cPost\u5177\u4f53\u533a\u522b\uff1f"}
{"url": "http://www.58maisui.com/2016/05/23/a-13/", "text": "12\u4e2a\u5bf9\u4f60\u7f16\u7a0b\u5b66\u4e60\u6709\u610f\u7684\u7f51\u7ad9"}
{"url": "http://www.devstore.cn/essay/essayInfo/6673.html", "text": "\u6700\u5168\u524d\u7aef\u8d44\u6e90\u6c47\u96c6\uff08\u8865\u5145\u7248\uff09"}
{"url": "http://www.devstore.cn/essay/essayInfo/6713.html", "text": "\u4e00\u4efd\u5168\u9762\u7cfb\u7edf\u7684\u6e10\u53d8\u8272\u81ea\u5b66\u6307\u5357"}
{"url": "http://tson.com/pv-data/", "text": "\u8d2d\u4e70\u865a\u62df\u4e3b\u673a\u65f6\u6708\u6d41\u91cf\u4e0e\u7f51\u7ad9PV\u7684\u5927\u81f4\u5173\u7cfb"}
{"url": "http://mp.weixin.qq.com/s?__biz=MzIwNDI3MTE0OQ==&mid=2650154865&idx=1&sn=6a9cbcb9b680d10a8ab9d490abd00df9&scene=4#wechat_redirect", "text": "\u5199\u4e2a Hello World\uff0c\u5c45\u7136\u53ef\u4ee5\u8fd9\u4e48\u9707\u64bc"}
{"url": "http://www.wanwuyun.com/pages/news/325.html", "text": "2016\u5e74\u5ea6\u6700\u53d7\u6b22\u8fce\u7684100\u4e2a Java \u5e93"}
{"url": "http://toutiao.com/i6294369824709558786/", "text": "\u521d\u5b66\u8005\u5c0f\u6307\u5357-SVN \u7b80\u5355\u642d\u5efa - \u4eca\u65e5\u5934\u6761(TouTiao.com)"}
{"url": "http://www.cnblogs.com/dahe007/p/5559366.html", "text": "\u5e2e\u6211\u505a\u4e2aAPP\uff0c\u7ed9\u4f6020\u4e07\uff0c\u505a\u4e0d\u505a\uff1f"}
{"url": "http://www.wanwuyun.com/pages/news/322.html", "text": "\u4f5c\u4e3a\u5f00\u53d1\u8005\u4e0d\u53ef\u4e0d\u6536\u85cf\u7684\u5341\u5927\u5f00\u53d1\u8bed\u8a00\u548c\u6846\u67b6"}
{"url": "http://blog.csdn.net/yuanziok/article/details/51593964", "text": "\u76d8\u70b9\uff1a2016\u4e2d\u56fd\u767e\u5f3a\u5730\u4ea7CIO\u9ad8\u5cf0\u8bba\u575b\u76848\u5927\u770b\u70b9"}
{"url": "http://geek.csdn.net/news/detail/76969", "text": "\u4ece0\u5f00\u59cb\u5b66\u4e60 GitHub \u7cfb\u5217\u4e4b\u300c\u52a0\u5165 GitHub\u300d"}
{"url": "http://www.chengxuyuan.com/post/415.html", "text": "\u7a0b\u5e8f\u5458\u88c5\u903c\u5b9e\u7528\u5b9d\u5178"}
{"url": "http://www.yunweipai.com/archives/7498.html", "text": "RightScale\u53d1\u5e03\u6700\u65b0DevOps\u8d8b\u52bf\u5206\u6790\u62a5\u544a\uff0c\u6211\u4eec\u53ef\u4ee5\u5728\u5176\u4e2d\u770b\u51fa\u4ec0\u4e48\uff1f"}
{"url": "http://www.techug.com/things-about-be-programmers-wife", "text": "\u505a\u7a0b\u5e8f\u733f\u7684\u8001\u5a46\u5e94\u8be5\u6ce8\u610f\u7684\u4e00\u4e9b\u4e8b\u60c5"}
{"url": "http://www.chinarobots.cn/admin_articleEdit.aspx?id=694", "text": "AlphaGo \u5c06\u4e0e\u4eba\u7c7b\u68cb\u624b\u7b2c\u4e00\u540d\u67ef\u6d01\u5bf9\u5c40\uff0c\u4eba\u5de5\u667a\u80fd\u8fdb\u5316\u5230\u4ec0\u4e48\u7a0b\u5ea6\u4e86\uff1f"}
{"url": "http://www.xttblog.com/?a=b&p=570", "text": "\u5f3a\u8fc7NFC\u7684\u57fa\u4e8e\u84dd\u7259\u4f4e\u529f\u8017\u7684Beacon\u6280\u672f\u8be6\u89e3"}
{"url": "http://www.chengxuyuan.com/post/358.html", "text": "\u897f\u6e38\u8bb0\u91cc\u5730\u5e9c\u751f\u6b7b\u7c3f\u7cfb\u7edf\u662f\u600e\u4e48\u5199\u7684\uff1f"}
{"url": "http://easygeek.com.cn/article/2Qf6Fj.html", "text": "\u4e00\u4e2a\u6545\u4e8b\u5e2e\u4f60\u7406\u89e3\u7ebf\u7a0b\u548c\u7ebf\u7a0b\u6c60"}
{"url": "http://easygeek.com.cn/article/iY3yue.html", "text": "Java\u5f00\u53d1\u5e38\u7528\u7684\u5728\u7ebf\u5de5\u5177"}
{"url": "http://www.cocoachina.com/programmer/20160513/16243.html", "text": "\u77e5\u9053\u8fd920\u4e2a\u6b63\u5219\u8868\u8fbe\u5f0f\uff0c\u80fd\u8ba9\u4f60\u5c11\u51991,000\u884c\u4ee3\u7801"}
{"url": "https://yq.aliyun.com/articles/53929", "text": "Android \u5e94\u7528\u67b6\u6784\u6982\u8ff0"}
{"url": "http://www.58maisui.com/2016/06/09/a-127/", "text": "\u6d45\u8c08Web\u7f51\u7ad9\u67b6\u6784\u6f14\u53d8\u8fc7\u7a0b"}
{"url": "http://www.chinarobots.cn/XingYeDongTai/672.html", "text": "\u5982\u4f55\u6210\u4e3a\u4e00\u4e2a\u901a\u6653\u591a\u79cd\u7f16\u7a0b\u8bed\u8a00\u7684\u7a0b\u5e8f\u5458"}
{"url": "http://blog.csdn.net/nayun123/article/details/51566623", "text": "\u62a5\u8868\u5f00\u53d1\u5982\u4f55\u5229\u7528\u81ea\u5b9a\u4e49\u51fd\u6570\u628a\u9633\u5386\u8f6c\u6362\u6210\u9634\u5386"}
{"url": "http://blog.csdn.net/yanzi1225627/article/details/51518063", "text": "\u7a0b\u5e8f\u5458\u505a\u5916\u5305\u88ab\u5751:\u641c\u4ee4\u514b\u7f51\u7edc\uff0c\u9879\u76ee\u5c3e\u6b3e\u4f55\u65f6\u8fd8?"}
{"url": "http://www.cnblogs.com/ownraul/p/5515132.html", "text": "\u7ed9Java\u65b0\u624b\u7684\u4e00\u4e9b\u5efa\u8bae"}
{"url": "http://www.chinarobots.cn/XingYeDongTai/678.html", "text": "27\u4e2aiOS\u5f00\u6e90\u5e93\uff0c\u8ba9\u4f60\u7684\u5f00\u53d1\u5750\u4e0a\u706b\u7bad\u5427"}
{"url": "http://www.jianshu.com/p/847097fbbcca", "text": "\u7a0b\u5e8f\u5458\u7684\u51e0\u5927\u75db\u70b9"}
{"url": "http://fetalk.net/2016/05/27/Eat-sleep-code-repeat-is-such-bullshit/", "text": "\u201c\u5403\u996d\u3001\u7761\u89c9\u3001\u5199\u4ee3\u7801\u3001\u5468\u800c\u590d\u59cb\u201d\uff0c\u4f55\u5176\u64cd\u86cb\u7684\u751f\u6d3b"}
{"url": "http://www.chengxuyuan.com/post/375.html", "text": "\u300c\u53ea\u5dee\u7a0b\u5e8f\u5458\u300d\u4e3a\u4ec0\u4e48\u4f1a\u62db\u9ed1\uff1f"}
'''

