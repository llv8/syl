from django.db import models

class User(models.Model):
    name = models.CharField(max_length=50)
    ids = models.IntegerField(default=0)
    email = models.EmailField(max_length=50)
    phone = models.CharField(max_length=20)
    status = models.IntegerField(default=0)  # 01:email valid,10:phone valid,11:email and phone valid,00:email and phone not valid
    pwd = models.CharField(max_length=32)
    
# each user can create 5 groups
class Group(models.Model):
    name = models.CharField(max_length=50)
    manger = models.ForeignKey(User)
    
# each group can mostly add 50 users    
class GroupUser(models.Model):
    gourp = models.ForeignKey(Group)
    user = models.ForeignKey(User)
    status = models.IntegerField(default=0)  # 0:invalid,1:valid

# Inactive need email or phone valid, Supression : the user has illegal operator
USER_STATUS = {'0':'None', '1':'Email Active', '2':'PHone Active', '3':"Both Active"}

# Inactive need group manager to active
GROUP_USER_STATUS = {'':'Inactive', '1':'Active'}
