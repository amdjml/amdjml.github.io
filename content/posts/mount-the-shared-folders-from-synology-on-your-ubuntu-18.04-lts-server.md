---
title: "Mount the Shared Folders From Synology on Your Ubuntu 18.04 LTS Server"
date: 2020-02-13T08:33:27-05:00
category: tech
tags: 
   - nfs
   - ubuntu
   - synology
   - storage
   - nas
draft: false
---

Have you ever wondered how you can share your folders on your Synology with your linux server for extra storage? Well, I have a Plex server at home and I wanted to rebuild this server from scratch but had no where to put my media. I decided to connect my Synology NAS to my Plex server and use it as a temporary storage.

In this guide, I will show you how I managed to do this and how you can achieve the same result. It is pretty easy, so, let's get started.

## 1. Gather some basic information
In this scenario, I am going to refer to my Plex server as "Source" and my Synology NAS as "Destination".

* Source IP: 10.10.10.12
* Destination IP: 10.10.10.252
* Protocol used: NFS
* Folders being shared: music, movies, tvshows

## 2. Prepare the source
Now that we have some basic information, let's prepare the source. What you need to do is to install the NFS client on your Plex server to be able to connect to Synology. SSH to your Plex server and issue the following command:

`# sudo apt install nfs-common`

That is all the packages we need. Now, let's create a mounting point for our shared folders. Since I am going to mount 3 different folders, I am going to create 3 different mounting points on our source.

`# mkdir /media/NAS`  
`# mkdir media/NAS/music`  
`# mkdir media/NAS/movies`  
`# mkdir media/NAS/tvshows`  

Now that we created the mounting points, we can start mounting, but, we have to go to Synology to set the right permissions before we can do this. I'll show you how to do this in the next step.

## 3. Prepare the Destination
Login to your Synology and enable the NFS. To do this, follow the steps below:

1. Log into DSM with an account belonging to the **administrators** group
2. Go to **Control Panel > File Services**
3. On the **Win/Mac/NFS** tab, tick the box **Enable NFS**.
4. Click **Apply** to save settings.


### Assign NFS Permissions to Shared Folders
Before you can mount and access these folders on your source, you must configure the NFS permissions of the shared folders. Follow along to do this:

1. Go to **Control Panel > Shared Folder**.
2. Select the shared folder that you wish to access from your source, and click **Edit**.
3. Go to the **NFS Permissions** tab. Click **Create**.
4. Edit the following fields:
    * **Hostname or IP**: 10.10.10.12 (Enter your source IP).
    * **Privilege**: Select read/write permissions for the source.
    * **Squash**: Leave as default.
    * **Enable asynchronous**
5. Click **OK** to finish.
6. Click **OK** to apply the NFS permissions.

On the **Edit Shared Folder ...**, please take a note of the **Mount path:** on the bottom left. This will come handy when we are mounting these folders on our source. Follow the above steps for any additional folders.

## 4. Mount a Share
Now that we have everything ready, let's mount our first folder.

`# sudo mount 10.10.10.252:/volume1/music /media/NAS/music`

Repeat this for any remaining folders:

`# sudo mount 10.10.10.252:/volume1/movies /media/NAS/movies`  
`# sudo mount 10.10.10.252:/volume1/tvshows /media/NAS/tvshows`  

The mounted share should now be accessible on the Plex server. Check via CLI.

## Auto Mount at Boot
If you wish your folders to be mounted automatically after every reboot/shutdown, add an entry to the `/etc/fstab` file.

`# vi /etc/fstab`

```
10.10.10.252:/volume1/music /media/NAS/music    nfs rsize=8192,wsize=8192,timeo=14,intr
10.10.10.252:/volume1/movies /media/NAS/movies    nfs rsize=8192,wsize=8192,timeo=14,intr
10.10.10.252:/volume1/tvshows /media/NAS/tvshows    nfs rsize=8192,wsize=8192,timeo=14,intr
```
