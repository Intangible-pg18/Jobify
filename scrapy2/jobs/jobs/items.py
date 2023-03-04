# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class JobsItem(scrapy.Item):
    # define the fields for your item here like:
    post = scrapy.Field()
    company = scrapy.Field()
    location = scrapy.Field()
    details_link = scrapy.Field()

