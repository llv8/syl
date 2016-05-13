from django.test import TestCase
import hashlib
import re


# Create your tests here.
data =  'This a md5 test!'
hash_md5 = hashlib.md5(data)
print(hash_md5.hexdigest())