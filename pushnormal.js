if [ $# -ne 2 ]; then
	echo "Wrong param! It should be: ./pushnormal 'branch_name' 'commit comment'"
	exit 1
fi

BRANCH=$1
COMMENT=$2
git add .
git commit -m "$COMMENT"
git push --set-upstream origin $BRANCH
