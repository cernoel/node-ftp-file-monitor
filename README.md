node-ftp-file-monitor
===

It checks the Time-difference between 'now' and 'FTP filechange Time'.
If that differs too much, it sends an email. That's it.

It does not run as service, use it with cron or taskplanner like tool to trigger it.

I only use it under Windows, but i am pretty sure it works everywhere, 
because i used native librarys.

### To install:

Prerequisites :

    * nodejs or iojs
	* npm
	* cron or taskplaner like tool.


node_modules:

	* emailjs
	* ftp


Resources:
---

	- [nodejs] (http://nodejs.org/)
	- [iojs] (https://iojs.org/)
	- [emailjs] (https://github.com/eleith/emailjs)
	- [ftp] (https://github.com/mscdex/node-ftp)
