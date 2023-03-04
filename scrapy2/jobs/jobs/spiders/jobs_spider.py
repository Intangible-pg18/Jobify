import scrapy
from ..items import JobsItem


class JobsSpider(scrapy.Spider):
    name = 'jobspider'
    start_urls = [
            "https://www.shine.com/job-search/jobs?early_applicant=true&top_companies=true&sort=1&farea=4530&farea=3301&farea=1301&farea=4559&farea=1313&farea=1401&farea=4475&farea=4429&farea=1312&farea=4462&farea=1405&farea=2803&farea=3402&farea=1001&farea=4526&farea=510&farea=4560",
            "https://internshala.com/jobs/page-1/"
        ]
    page = 2

    def parse(self, response):  # "response" contains the source code of the website we want to scrape
        items = JobsItem()

        if 'shine.com' in response.url:
            job_boxes = response.css(".jobCard")
            next_page = response.css(".jsrp_pagination___E0Vc a:last-child::attr(href)").extract()[0]
            for job_box in job_boxes:
                post = job_box.css('h2::text').extract()
                company = job_box.css('.jobCard_jobCard_cName__mYnow span::text').extract()
                location = job_box.css('.jobCard_locationIcon__zrWt2::text').extract()
                details_link = job_box.css('meta::attr(content)').extract()
                items["post"] = post
                items["company"] = company
                items["location"] = location
                items["details_link"] = details_link
                yield items

            #if next_page is not None and int(next_page.split('jobs-')[1].split('?')[0]) <= 100:
            if next_page is not None:
                next_page = 'https://www.shine.com/job-search/' + next_page
                yield response.follow(next_page, callback=self.parse)

        if 'internshala.com' in response.url:
            job_boxes = response.css(".visibilityTrackerItem")
            total_pages = int(response.css("#total_pages::text").get())

            for job_box in job_boxes:
                post = job_box.css('.profile .view_detail_button::text').extract()
                company = job_box.css('.link_display_like_text::text').extract()
                location = job_box.css('#location_names .view_detail_button::text').extract()
                details_link = job_box.css('.cta_container a::attr(href)').extract()
                items["post"] = post
                items["company"] = company
                items["location"] = location
                details_link = ["https://www.internshala.com" + s for s in details_link]
                items["details_link"] = details_link
                yield items

            next_page_int = 'https://internshala.com/jobs/page-' + str(JobsSpider.page) + '/'
            #if JobsSpider.page <= total_pages and JobsSpider.page <= 100:
            if JobsSpider.page <= total_pages:
                JobsSpider.page += 1
                yield response.follow(next_page_int, callback=self.parse)

