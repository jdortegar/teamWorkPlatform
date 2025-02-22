# webapp - teamWorkPlatform Web App

## Workflow:
If you are not familiar with git, PLEASE read up on the subject before proceeding. A good reference is Professional Git by Brent Laster.

To setup your local repository: Once you have installed git, create a local folder called habla-dev. This will be the root for all of your git repos for Habla work. From this folder, then use the command:

```
$ git clone https://gituser:password@github.com/Habla-Inc/mobileapp.git mobileapp
Cloning into 'mobileapp'...
remote: Counting objects: 20, done.
remote: Compressing objects: 100% (3/3), done.
remote: Total 20 (delta 0), reused 0 (delta 0), pack-reused 17
Unpacking objects: 100% (20/20), done.
```

This creates a folder under habla-dev called mobileapp that contains a clone of the origin repository. In git parlance, the origin repository is the one hosted in GitHub, and the remote repository is the one on your local machine. At this moment, the remote repo on your machine is in synch with the origin.

To see the status of the repository on your machine:

```
$ git status
On branch development
Your branch is up-to-date with 'origin/development'.
nothing to commit, working tree clean
```

To see the history of the repo that you just cloned:

```
$ git log --oneline --decorate --graph --all
* 818be50 (HEAD -> development, origin/development, origin/HEAD) Cleaning up setup work
*   63587cb Merge branch 'development' of https://github.com/Habla-Inc/mobileapp into development
|\  
| * 9edbb6d Update README.md
| * 83694fd Update README.md
| * bc62bbe (origin/master) Update README.md
* |   2d6dcc0 Merge branch 'feat-123' into development
|\ \  
| |/  
|/|   
| * 52c3959 added test2 file
| * 0bf9592 added test file
|/  
* 4a3d5b6 Initial commit
```

When you are ready to begin work on a specific feature, create a new branch. The branch should be named according to the story or bug ID related to your work. It is always safest to re-pull the code from github to make sure that you are working on the latest checkin. This reduces the effort to merge your work back into the codebase and reduces the likelihood of clobbering in-flight work of others. For example, if you are working on a feature with the story tag FEAT-123, you type:

```
$ git checkout -b feat-123 development
Switched to a new branch 'feat-123'
```

and this creates a local branch feat-123 for your feature work, if it doesn't already exist. As you do development work, you use the following commands (among others) to maintain your local repo:

```
git status
git add
git commit
git log --oneline --decorate --graph --all
```

As you make changes and additions to your project, it is wise to commit them to your local repository. As a general rule, commits to your local repo should be made each time you complete a discrete piece of functionality and the code compiles. You should avoid adding code that breaks the build to the repository. To determine which files to add to your commit:

```
$ git status
On branch feat-123
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")
```

We see that README.md has been modified and not yet added to the commit. To add it:

```
$ git add README.md
$ git status
On branch feat-123
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	modified:   README.md
```

So the file is staged and ready to be committed. To commit the change:

```
$ git commit -m "Added additional verbosity to the README.md file."
[feat-123 3dfe877] Added additional verbosity to the README.md file.
 1 file changed, 33 insertions(+), 6 deletions(-)
```

Once you have added files and committed changes to your local branch, you must create this branch in the origin repository. This is done by :

```
$ git push --set-upstream origin feat-123
Counting objects: 3, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 908 bytes | 0 bytes/s, done.
Total 3 (delta 1), reused 0 (delta 0)
remote: Resolving deltas: 100% (1/1), completed with 1 local objects.
To https://github.com/Habla-Inc/mobileapp.git
 * [new branch]      feat-123 -> feat-123
Branch feat-123 set up to track remote branch feat-123 from origin.
```

You should regularly push your local branch to the repository to prevent accidental loss of work. This is done by:

Once your feature work is complete, please contact the scrum master to coordinate merge into the main development branch.

To merge your feature branch into the development branch:

```
$ git checkout development
Switched to branch 'development'
Your branch is up-to-date with 'origin/development'.
$ git merge --no-ff feat-123
Merge made by the 'recursive' strategy.
 README.md | 86 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++-----------
 1 file changed, 75 insertions(+), 11 deletions(-)
```

You no longer need the feat-123 branch since this work has been completed, so delete the branch by:

```
$ git branch -d feat-123
Deleted branch feat-123 (was e150c2b).
```

Now push your changes up to the origin:

```
$ git push
Counting objects: 1, done.
Writing objects: 100% (1/1), 251 bytes | 0 bytes/s, done.
Total 1 (delta 0), reused 0 (delta 0)
To https://github.com/Habla-Inc/mobileapp.git
   818be50..0409625  development -> development
```

## Project Syntax
### Production: 
1. $ npm run build
2. $ node server

TODO before Production push:
1. Minifize : app.css, images, ---> Tho's job
2. Change local images to cdn links: ---> Tho's job
	a. index.html
	b. components/Header
	c. homepage/components/header_navbar.js
	d. resources/style/_homepage.scss
3. npm run build
4. Overwrite: node_modules/react-graph-vis/lib/index.js ---> Rob's job
 

