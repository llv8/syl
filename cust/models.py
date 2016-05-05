from django.db import models

class User(models.Model):
    name = models.CharField(max_length=50)
    ids = models.IntegerField(default=0)
    email = models.EmailField(max_length=50)
    phone = models.CharField(max_length=20)
    status = models.IntegerField(default=0)

# each user can create 5 groups
class Group(models.Model):
    name = models.CharField(max_length=50)
    manger = models.ForeignKey(User)
    
# each group can mostly add 50 users    
class GroupUser(models.Model):
    gourp = models.ForeignKey(Group)
    user = models.ForeignKey(User)
    status = models.IntegerField(default=0)

# Inactive need email or phone valid, Supression : the user has illegal operator
USER_STATUS = {'0':'Inactive', '1':'Active', '2':'Supression'}

# Inactive need group manager to active
GROUP_USER_STATUS = {'':'Inactive', '1':'Active'}
