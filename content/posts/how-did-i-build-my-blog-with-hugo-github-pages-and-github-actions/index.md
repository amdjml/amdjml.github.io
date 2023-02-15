---
title: "How Did I Build My Blog With Hugo Github Pages and Github Actions"
date: 2021-03-24T12:42:44-04:00
show_gallery: false
category: tech
tags: 
   - hugo
   - github
   - pages
   - actions
draft: false
---
# How did I build my blog with Hugo, Github Pages, and Github Actions
For a while I was looking to start a blog and share my thoughts and experiences on different topics, mainly technology and homelabbing, but I kept putting it aside because just the thought of setting up a VPS and then installing Wordpress, database, etc. was daunting.

## Hello Hugo!
I started to look into another way of achieving this and I came across [Hugo](https://gohugo.io/).
> Hugo is one of the most popular open-source static site generators. With its amazing speed and flexibility, Hugo makes building websites fun again.

With this new discovered tool, I was set to make this happen. I started to dig into how to make this as easy and painless as possible and automate it if possible.

## Domain
I purchased amdjml.com and then pointed that domain to Github nameservers. You can go to [Configure a custom domain for your GitHub Pages site](https://docs.github.com/en/github/working-with-github-pages/configuring-a-custom-domain-for-your-github-pages-site) on the GitHub site and follow their instructions.

## GitHub
You need a GitHub account, you can [Sign Up Here](https://github.com/join) or [Login Here](https://github.com/login) if you already have an account.

## Repositories
I wanted to setup a private and a public repos so I can keep my drafts separate from my production repo as not to make it too complicated for myself.

Create 2 repositories, one should be private and one should be public. Just keep in mind that your public repo needs to have a name in this format: `<GithubUsername>.github.io`. The private repo name can be anything you want. For more information on how GitHub Pages work, please go [here](https://pages.github.com/).

## Actions Deoplyment Key
Now that you have both repos created, we need to establish a way for our GitHub Actions to be able to reach them both to build and deploy our public site. To do this, we need to create a SSH keypair. You can follow the instructions [here](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key) on how to generate a new SSH key.

Now that you have the private and public key, we need to add them to our private and public repos. For the private repo do the followings:

Go to Settings > Secrets > New repository secrets

<strong>Name:</strong> ACTIONS_DEPLOY_KEY <br>
<strong>Value:</strong> Copy/paste the private key content from previous step here

For the public repo, do the followings:

Go to Settings > Deploy keys > Add deploy key

<strong>Name:</strong> Can be anything you want <br>
<strong>Value:</strong> Copy/paste the public key content from previous step here

## Hugo
You need to install Hugo on your machine to be able to write your posts and then push those to your GitHub repository and eventually update your blog.

Before installing Hugo and deploying your site, make sure you clone the private repository to your machine.

For example: `git clone git@github.com:amdjml/<repoName>.git`

I am not going to reinvent the wheel and tell you how to install Hugo when they do a much better job on their site with a [Quick Start](https://gohugo.io/getting-started/quick-start/) guide.

> You must create your new hugo site with the same name and in the same place as your private repo that you cloned earlier. You'll be prompted to use the `--force` to create the new Hugo site within the private folder.

Once you created your first post, use git to push those changes to your private repo.

## GitHub Actions
Now we are going to create the Actions that will build and deploy your Hugo site into a static site and push those to your public repo to be displayed on your site.

Create a new file named `gh-pages.yml` in `<HugoInstallationDir>/.github/workflows/`. Insert the following code inside that file, replace the marked values with your own, save and close the file.

```yml
name: github pages

on:
  push:
    branches:
      - main  # Set a branch name to trigger deployment

jobs:
  deploy:
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true  # Fetch Hugo themes (true OR recursive)
          fetch-depth: 0    # Fetch all history for .GitInfo and .Lastmod

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'

      - name: Build
        run: hugo --minify

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          deploy_key: ${{ secrets.ACTIONS_DEPLOY_KEY }}
          external_repository: <GithubUsername>/<GithubUsername>.github.io # Replace with Github Username
          publish_branch: main
          publish_dir: ./public
          cname: <domain>.com # Replace with your domain
```
Once you have saved it, it should trigger the action and build the static html pages from your private repo and push them to your public repo.

## Conclusion
You should have a Hugo site now and you can just write your posts on your local machine, push those changes to your private repo on GitHub and let the Actions take care of the rest.

Hope you enjoyed reading this article and let me know what you think!
