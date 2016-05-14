from django.db import models

class User(models.Model):
    name = models.CharField(max_length=50)
    ids = models.IntegerField(default=0)
    email = models.EmailField(max_length=50)
    phone = models.CharField(max_length=20)
    status = models.IntegerField(default=0)
    utime = models.FloatField(default=0)
    ltime = models.FloatField(default=0)
    pwd = models.CharField(max_length=32, default='')
    
# each user can create 5 groups
class Group(models.Model):
    name = models.CharField(max_length=50)
    manager = models.ForeignKey(User)
    utime = models.FloatField(default=0)
    
# each group can mostly add 50 users    
class GroupUser(models.Model):
    group = models.ForeignKey(Group)
    user = models.ForeignKey(User)
    status = models.IntegerField(default=0)  # 0:invalid,1:valid
    utime = models.FloatField(default=0)

# Inactive :unlogin
USER_STATUS = {'-1':'Removed', '0':'InActive', '1':'Active'}

# Inactive need group manager to active
GROUP_USER_STATUS = {'':'Inactive', '1':'Active'}
