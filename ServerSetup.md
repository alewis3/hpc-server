# Setting up the server

## Adding an ssh key: 

`cat ~/.ssh/sp-team1-ssh.pub` to copy the public key from local machine.

Then login to the server and do: 

`mkdir -p ~/.ssh` to make the ssh directory

`nano ~/.ssh/authorized_keys` to create the authorized keys file. 

Paste contents of the ssh key you copied.

The `~/.ssh` directory and `authorized_keys` file must have specific restricted permissions (700 for `~/.ssh` and 600 for `authorized_keys`)

```
chmod -R go= ~/.ssh
chown -R team1:$team1 ~/.ssh
```

---

## Add a user: 

Add a user:
`adduser team1`

Give user sudo permissions:

`usermod -aG sudo team1`

Log out of droplet and log back into the server with the new user's name.

---

## Set firewall permissions:

Check status of firewall: 
`sudo ufw status`

See all apps that are allowed: 
`sudo ufw app list`

Allow OpenSSH traffic: 
`sudo ufw allow OpenSSH` or `sudo ufw allow ssh`

Allow http: 
`sudo ufw allow http`

Allow https: 
`sudo ufw allow https`

Enable the firewall: 
`sudo ufw enable`

---

## Installing nginx: 

Log in as non-root user, and enter commands: 

```
sudo apt update
sudo apt install nginx
```

Verify that nginx is allowed by entering the command: `sudo ufw app list`

Nginx should have a full app, an http app, and an https app.

### Check your web server is running: 

`systemctl status nginx`

### Sonme basic management commands for nginx: 

```
// To stop the web server: 
sudo systemctl stop nginx

// To start the web server while it is stopped: 
sudo systemctl start nginx

// to stop and then start the service again: 
sudo systemctl restart nginx

// If you are making configuration changes, nginx can reload without dropping connections: 
sudo systemctl reload nginx

// By default, nginx is configured to start automatically when the server boots. If this is not what you want, you can disable this behavior by typing: 
sudo systemctl disable nginx

// To re-enable the service to start up at boot, type:
sudo systemctl enable nginx
```
---

## Installing mongo: 

Get list of updated packages and use: 

```
sudo apt update
sudo apt install -y mongodb
```

to check that mongo is running, use: 

```
sudo systemctl status mongodb
```

To allow mongo connections thru the firewall, use: 

```
sudo ufw allow 27017
```

Open the mongo conf file: 

```
sudo nano /etc/mongodb.conf
```

Change the bind_ip address to look like this: 

```
bind_ip = 127.0.0.1, 192.241.134.242 (our server ip)
```
This is so that the db can allow remote connections.

For more info: see [integrating mongodb with your node application](https://www.digitalocean.com/community/tutorials/how-to-integrate-mongodb-with-your-node-application) and [securing your mongo db server](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-mongodb-on-ubuntu-16-04)

--- 

## Lastly, installing Certbot to get HTTPS certificates

Run these commands to add certbot ppa: 

```
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
```

Run this command to install certbot: `sudo apt-get install certbot python-certbot-nginx`

Run this command to get a certificate and have certbot edit your nginx configuration automaticlaly to serve it, turning on HTTPS access in a single step: `sudo certbot --nginx`