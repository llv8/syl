from django.db import models

# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=50)
    gender = models.BooleanField()
    email = models.CharField(max_length=50)
    phone = models.CharField(max_length=20)
    status = models.IntegerField(default=0)

#each user can create 5 groups
class Group(models.Model):
    name = models.CharField(max_length=50)
    manger = models.ForeignKey(User)
    
class GoupUser(models.Model):
    gourp = models.ForeignKey(Group)
    user = models.ForeignKey(User)
    status=models.IntegerField()

#Inactive need email or phone valid, Supression : the user has illegal operator
USER_STATUS={'0':'Inactive','1':'Active','2':'Supression'}

#Inactive need group manager to active
GROUP_USER_STATUS={'':'Inactive','1':'Active'}
    