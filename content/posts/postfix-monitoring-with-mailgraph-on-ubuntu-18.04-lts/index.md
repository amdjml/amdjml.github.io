---
title: "Postfix Monitoring With Mailgraph on Ubuntu 18.04 Lts"
date: 2019-01-24T15:45:01-05:00
category: tech
tags: 
   - postfix
   - mailgraph
   - ubuntu
   - linux
draft: false
---

If you have a postfix mail relay server, like I do, or a postfix mail server, you want to
monitor it with Mailgraph. Mailgraph generates daily, weekly, monthly, and yearly graphs of
sent, received, bounched, and rejected emails.

This is a very simple install and I'll describe how to install and configure Mailgraph on
Ubuntu 18.04 LTS.

## 1. Before you begin
In this tutorial, my VM has the IP address 192.168.1.100 and hostname is postfix.domain.local. Make sure to replace the hostname and IP address with your own info wherever it appears.

Please note that you need to have a web server like apache2 installed before you beging this installation. The apache2 installation is not in the scope of this tutorial, please google search that before you attempt this.

## 2. Mailgraph installation
Ubuntu 18.04 LTS has a package for Mailgraph in its repositories, so we can just use `apt` to install it. Along with Mailgraph, we need to install RRDtool to store the data which will be used by Mailgraph to generate the graphs:

`# apt install rrdtool mailgraph -y`

Now we can configure the Mailgraph package like so:

`# dpkg-reconfigure mailgraph`

You'll be presented with the following questions:

* Should Mailgraph start on boot? **YES**
* Logfile used by mailgraph: **/var/log/mail.log**
* Ignore mail to/from localhost? **No**

For most of the people, the answer for the last question will be no by default unless you have integrated a content filter like amavisd into Postfix. In this case you'll need to answer **YES** to this question.

## 3. Configure apache2
Now we need to configure apache2 to serve the Mailgraph cgi script for us to access it:

`# vi /etc/apach2/sites-available/mailgraph.conf`

```apache
# Mailgraph Configuration
# Replace [192.168.1.0/24] with your own internal network
Alias /mailgraph /usr/lib/cgi-bin
<Directory /usr/lib/cgi-bin>
    Options +FollowSymLinks +ExecCGI
    AddHandler cgi-script .cgi
    Require local
    Require ip 192.168.1.0/24
</Directory>
 ```

`# e2enmod cgid`  
`# a2ensite mailgraph`  
`# systemctl restart apache2 mailgraph`  


## 4. Success
You are all done, you can access it by going to `http://(hostname or IP address)/mailgraph/mailgraph.cgi` with a Web Browser, then Mailgraph index site will be shown and it's possible to see statics for any future activities.

![Mailgraph](images/mailgraph.png "Mailgraph Stats")
