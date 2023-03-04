# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter

import mysql.connector


class JobsPipeline(object):

    id = 1
    def __init__(self):
        self.curr = None
        self.conn = None
        self.create_connection()
        self.create_table()
        self.remove_duplicates()

    def create_connection(self):
        self.conn = mysql.connector.connect(
            host='localhost',
            user='root',
            passwd='Edndash887.',
            database='job_data'
        )
        self.curr = self.conn.cursor()

    def create_table(self):
        self.curr.execute("""DROP TABLE IF EXISTS job_main_data""")
        self.curr.execute("""create table job_main_data(
                            Job_ID int(7),
                            Post text,
                            Company text,
                            Location text,
                            Details_link text)
                            """)

    def store_data(self, item):
        locations = ', '.join(item['location'])
        self.curr.execute("""insert into job_main_data values (%s,%s,%s,%s,%s)""", (
            JobsPipeline.id,
            item['post'][0],
            item['company'][0].strip().replace("\n", ""),
            locations,
            item['details_link'][0]
        ))
        JobsPipeline.id = JobsPipeline.id+1
        self.conn.commit()

    def remove_duplicates(self):
        self.curr.execute("""DELETE t1 FROM job_main_data t1
                            INNER JOIN job_main_data t2 
                            WHERE t1.Post = t2.Post
                            AND t1.Company = t2.Company
                            AND t1.Location = t2.Location
                            AND t1.Details_Link = t2.Details_Link
                            AND t1.Job_ID > t2.Job_ID""")
        self.conn.commit()

    def process_item(self, item, spider):
        self.store_data(item)
        return item
