if [ $# -ne 2 ]; then
	echo "Wrong param! It should be: ./pushdevelopment 'branch_name' 'commit comment'"
	exit 1
fi

BRANCH=$1
COMMENT=$2
git checkout development
git merge --no-ff $BRANCH
git add .
git commit -m "$COMMENT"
git push origin development
