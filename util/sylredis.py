'''
Created on May 11, 2016

@author: lewis
'''
import redis


pool = redis.ConnectionPool(host='127.0.0.1', port=6379, max_connections=10)
def get_redis():
    return redis.Redis(connection_pool=pool)
def set_vcode(vcode):
    get_redis().set('vcode', vcode, 60 * 60)


