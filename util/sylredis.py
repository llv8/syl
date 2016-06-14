'''
Created on May 11, 2016

@author: lewis
'''
import redis


pool = redis.ConnectionPool(host='127.0.0.1', port=6379, max_connections=10)
def get_redis():
    return redis.Redis(connection_pool=pool)
def set_vcode(userid, vcode):
    set_str(str(userid) + '_vcode', vcode, 60 * 60)
    
def get_vcode(userid):
    return get_str(str(userid) + '_vcode') 

def get_str(key):
    return get_redis().get(key)

def set_str(key, val, expire=None):
    if(expire):
        get_redis().setex(str(key), val, expire)
    else:
        get_redis().set(str(key), val)
        
def del_str(key):
    get_redis().delete(key)
    
def exi_str(key):
    return get_redis().exists(key)

def set_user(user_dict):
    get_redis().hmset('u_'+str(user_dict['i']), user_dict);
    
    

