import config
import praw

class RedditHelper:

    number_of_posts_by_sub_reddit = 3
    time_filter = 'day'
    
    def get_posts_by_sub_reddit(self, sub_reddit_name):
        reddit = praw.Reddit(client_id = config.client_id, client_secret = config.client_secret, user_agent = config.user_agent)
        submissions = []

        for submission in reddit.subreddit(sub_reddit_name).top(time_filter=self.time_filter, limit=self.number_of_posts_by_sub_reddit):
            submissions.append(submission)
        
        return submissions