from sqlalchemy import Column, String, Integer, Float, Date
from sqlalchemy import create_engine, ForeignKey
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import uuid
import datetime

Base = declarative_base()
engine = create_engine('mysql+pymysql://root:sahara123456@localhost:3306/test')
DBSession = sessionmaker(bind=engine)

# ORM Definition
class User(Base):
    __tablename__ = 'users'

    userid = Column(String(64), primary_key=True)
    openid = Column(String(32))
    age = Column(Integer)
    gender = Column(Integer)
    height = Column(Float)
    weight = Column(Float)

class Category(Base):
    __tablename__ = 'categories'
    
    categoryid = Column(String(64), primary_key=True)
    categoryname = Column(String(20))
    categoryimage = Column(String(128))
    
class Item(Base):
    __tablename__ = 'items'
    
    itemid = Column(String(64), primary_key=True)
    categoryid = Column(String(64), ForeignKey(Category.categoryid))
    itemname = Column(String(64))
    itemintro = Column(String(128))

class ItemImage(Base):
    __tablename__ = 'itemimages'
    
    imageid = Column(String(64), primary_key=True)
    itemid = Column(String(64), ForeignKey(Item.itemid))
    imageurl = Column(String(128))
    
class Record(Base):
    __tablename__ = 'records'
    
    recordid = Column(String(64), primary_key=True)
    userid = Column(String(64), ForeignKey(User.userid))
    itemid = Column(String(64), ForeignKey(Item.itemid))
    date = Column(Date)

# Utils
def generate_id_str():
    return str(uuid.uuid1().hex)
    
# Users
def get_user_info_with_userid(userid):
    session = DBSession()
    user_info = session.query(User).filter(User.userid==userid).first()
    session.close()
    return user_info

def get_user_info_with_openid(openid):
    session = DBSession()
    user_info = session.query(User).filter(User.openid==openid).first()
    session.close()
    return user_info

def get_openid_with_userid(userid):
    session = DBSession()
    user_info = session.query(User).filter(User.userid==userid).first()
    session.close()
    return user_info.openid

def add_new_user(openid):
    session = DBSession()
    new_userid = 'user-' + generate_id_str()
    new_user = User(userid=new_userid,
                   openid=openid,
                   age=20,
                   gender=1,
                   height=165.5,
                   weight=65.4)
    session.add(new_user)
    session.commit()
    session.close()
    return new_userid

def update_user_info(new_user_info):
    session = DBSession()
    old_user_info = session.query(User).filter(User.userid==new_user_info.userid).first()
    if old_user_info != None:
        old_user_info.age = new_user_info.age
        old_user_info.gender = new_user_info.gender
        old_user_info.height = new_user_info.height
        old_user_info.weight = new_user_info.weight
    session.commit()
    user_info = get_user_info_with_userid(old_user_info.userid)
    session.close()
    return user_info
    
# Categories
def get_all_categories():
    session = DBSession()
    categories = session.query(Category).all()
    session.close()
    return categories

def add_new_category(name, imageurl):
    session = DBSession()
    new_categoryid = 'catego-' + generate_id_str()
    new_category = Category(categoryid=new_categoryid,
                           categoryname=name,
                           categoryimage=image)
    session.add(new_category)
    session.commit()
    session.close()
    return new_categoryid

# Items
def get_all_items():
    session = DBSession()
    items = session.query(Item).all()
    session.close()
    return items

def get_items_with_categoryid(categoryid):
    session = DBSession()
    items = session.query(Item).filter(Item.categoryid==categoryid).all()
    session.close()
    return items

def get_item_info_with_itemid(itemid):
    session = DBSession()
    item_info = session.query(Item).filter(Item.itemid==itemid).first()
    session.close()
    return item_info

def get_itemname_with_itemid(itemid):
    session = DBSession()
    item_info = session.query(Item).filter(Item.itemid==itemid).first()
    session.close()
    return item_info.itemname

def add_new_item(categoryid, name, intro):
    session = DBSession()
    new_itemid = 'item-' + generate_id_str()
    new_item = Item(itemid=new_itemid,
                    categoryid=categoryid,
                    itemname=name,
                    itemintro=intro)
    session.add(new_item)
    session.commit()
    session.close()
    return new_itemid

# Images
def get_all_images():
    session = DBSession()
    images = session.query(ItemImage).all()
    session.close()
    return images

def get_images_with_itemid(itemid):
    session = DBSession()
    images = session.query(ItemImage).filter(ItemImage.itemid==itemid).all()
    session.close()
    return images

def add_new_image(itemid, imageurl):
    session = DBSession()
    new_imageid = 'image-' + generate_id_str()
    new_image = ItemImage(imageid=new_imageid,
                         itemid=itemid,
                         imageurl=imageurl)
    session.add(new_image)
    session.commit()
    session.close()
    return new_imageid

# Records
def get_records_with_userid(userid):
    session = DBSession()
    records = session.query(Record).filter(Record.userid==userid).all()
    session.close()
    return records

def add_new_record(userid, itemid):
    session = DBSession()
    new_recordid = 'record-' + generate_id_str()
    new_record = Record(recordid=new_recordid,
                       userid=userid,
                       itemid=itemid,
                       date=datetime.datetime.now())
    session.add(new_record)
    session.commit()
    session.close()
    return new_recordid