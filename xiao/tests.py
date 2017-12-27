from django.test import TestCase
from django.db import models
from django.db import connection
# Create your tests here.
import random,string,uuid
from random import randint
from xiao import help
from .models import Title,Ordering
from xiao.models import LEVEL_CHOICES
class Tests(TestCase):
    def test(self):
        tmp = False
        print("fefef")
        print(help.test1())
        print(help.PathAndRename('11.jpg'))
        self.assertEqual(tmp, False)


    def test2(self):
        latest_list = Title.objects.order_by('-pub_date')
        for p in latest_list:
            print(p.pk)
        print('999')
        #rand_str = lambda n: ''.join([random.choice(string.lowercase) for i in range(n)])
        #s = rand_str(10)
        #print(s)
        tmp =  uuid.uuid4().int & (1<<64)-1
        print(tmp)
        n = 32
        tmp = ''.join(["%s" % randint(0, 9) for num in range(0, n)])
        print(tmp)
        cursor = connection.cursor()
        cursor.execute("update xiao_ordering set status=1 where id=8982349817211874")
        print(LEVEL_CHOICES)
        print(dict(LEVEL_CHOICES))



