package sessions

import (
	"io/ioutil"
	"net/http"
	"strings"
)

const tokenURL = "https://dev-b9rpa8-6.us.auth0.com/oauth/token"
const auth0ClientID = "\"Xz1z63EBkAeFTWm6pwt6AbehLtX80k21\""
const auth0ClientSecret = "\"8JH_64KJtf66K19ZiUk30ulxXqLs_4liECQi26PRDgeOCPbayb1b5QL9e0LfWa9D\""
const audience = "\"https://ajidex.capstone.ischool.uw.edu\""
const grantType = "\"client_credentials\""

func CreateNewToken() ([]byte, error) {
	payload := strings.NewReader("{\"client_id\":" + auth0ClientID + ",\"client_secret\":" + auth0ClientSecret +
		",\"audience\":" + audience + ",\"grant_type\":" + grantType + "}")
	req, err := http.NewRequest("POST", tokenURL, payload)
	if err != nil {
		return nil, err
	}
	req.Header.Add("content-type", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)
	return body, nil
}
