---
title: "Kali Linux Will Not Boot on Dell Latitude E7450"
date: 2019-05-31T10:26:03-05:00
show_gallery: false
category: tech
tags: 
   - kali
   - linux
   - dell
   - latitude
   - e7450
draft: false
---

I wanted to install Kali Linux version 2019.2 on a Dell Latitude E7450. The installation is pretty straight forward once you are able to create a bootable USB drive and boot off of it.

I download the Kali ISO (Kali Linux 64-Bit) and used [Etcher](https://www.balena.io/etcher/) to flash the ISO on the USB flash drive.

Inserted the USB in the USB port and pressed F12 on the keyboard to go to the one time boot menu, selected the USB to boot off of and selected to install Kali.

Followed the on screen steps and decided to erase the previous OS completely and install Kali on the entire disk using the guided method. Grub boot loader got installed and it was time to reboot and take the installation media (USB flash drive) out.

The system rebooted just fine and I was at the login screen, was able to login and everything. The issue began when I decided to reboot for the second time. This time I was just getting a black screen that said "No Bootable Device Found".

To fix this, do the following:

* Reboot and press F12 to go to BIOS Setup
* Turn off Secure Boot (Settings -> Secure Boot -> Secure Boot Enable -> Disabled)
* Enable **UEFI** instead of Legacy (Settings -> General -> Boot Sequence -> Boot List Option -> EUFI)
* Under boot sequence uncheck everything if there are any options ((Settings -> General -> Boot Sequence -> Boot Sequence)
* Under boot list option, click on **Add Boot Option** (Settings -> General -> Boot Sequence -> Boot List Option)
* In the pop-up screen, type a name for your custom boot sequence under Boot Option Name
* Leave File System List alone
* Under File Name, click the button to the right of the input box (the one with 3 dots on it)
* Select EFI -> Kali -> grubx64.efi and then click OK

The newly created boot sequence should show up under Boot Sequence

Apply your changes and click Exit. You will see now that your machine boots into Kali Linux instead of giving you that error message.

Hopefully, this has helped you with your installation. I know I will come back to this article the next time I see that error.
