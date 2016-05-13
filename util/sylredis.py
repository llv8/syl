'''
Created on May 11, 2016

@author: lewis
'''
import redis


pool = redis.ConnectionPool(host='127.0.0.1', port=6379, max_connections=10)
def get_redis():
    return redis.Redis(connection_pool=pool)
def set_vcode(userid, vcode):
    get_redis().set(str(userid) + '_vcode', vcode, 60 * 60)
    
def get_vcode(userid):
    return get_redis().get(str(userid) + '_vcode')


