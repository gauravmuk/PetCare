# How to install locust
# sudo pip install --user locustio
# sudo pip install --user pyzmq

# how to run
# If testing locally
#       Run the node.js/express server on localhost:3000
#       locust -f my_locust_file.py -H http://localhost:3000
# If testing on Heroku
#       locust -f my_locust_file.py -H https://petcare-service.herokuapp.com
# go to http://127.0.0.1:8089/


from locust import HttpLocust, TaskSet, task

class UserBehavior(TaskSet):
    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        #self.login()

    #def login(self):
        # self.client.post("/login", {"username":"ellen_key", "password":"education"})

    @task(3)
    def index(self):
        self.client.get("/")

    @task(3)
    def sitterPosts(self):
        self.client.get("/petsitter_posts")

    @task(3)
    def forms(self):
        self.client.get("/forum")

    @task(3)
    def petPosts(self):
        self.client.get("/pet_posts")

    @task(3)
    def users(self):
        self.client.get("/users/1")

    @task(3)
    def signin(self):
        self.client.get("/signin")

    @task(3)
    def reviews(self):
        self.client.get("/api/users/2/reviews")

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait=20
    max_wait=22