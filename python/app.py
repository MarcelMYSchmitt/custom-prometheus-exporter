import os
import time
from prometheus_client import start_http_server, Gauge, Enum
import requests

class AvailabilityMetric:

    def __init__(self):

        self.availability = Gauge("ENDPOINT_AVAILABILITY", "Shows availability of endpoint.")

    def metrics_loop(self):

        while True:
            self.fetch()
            time.sleep(10)

    def fetch(self):

        url = os.getenv("URL")
        client_id = os.getenv("CLIENTID")
        client_password = os.getenv("CLIENTPASSWORD")

        print ("URL:", url, flush=True)
        print ("CLIENTID:", client_id, flush=True)

        try: 
            response = requests.post(url, data={}, auth=(client_id, client_password))
            status_code = response.status_code
            print ("Status Code:", status_code, flush=True)

            data = response.json()
            access_token = data["access_token"]
            token_type = data["token_type"]
            expires_in = data["expires_in"]
        
            if access_token and token_type and expires_in:
                print ("Access Token:", access_token, flush=True)
                print ("Token Type:", token_type, flush=True)
                print ("Expires In:", expires_in, flush=True)

                print ("Set endpoint availabilty metric to 1.")
                self.availability.set(1)
            else:
                print("Something went wrong, set endpont availabilty metric to 0.")
                self.availability.set(0)
        except:
                print("Something went wrong, set endpont availabilty metric to 0.")
                self.availability.set(0) 

def main():
    availabilityMetric = AvailabilityMetric()
    start_http_server(9877)
    availabilityMetric.metrics_loop()

if __name__ == "__main__":
    main()