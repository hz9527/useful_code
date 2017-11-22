read -p "are you sure publish webSite ? do not remember commit code  " -n 1 choose
if [[ $choose =~ ^[Yy]$ ]];then
  npm run build
  git checkout gh-pages
  if [[ 0 == $? ]];then
    echo 'checkout success'
    git pull origin gh-pages
    # 将dist中文件移至根目录
    rm index.html
    rm -rf ./static
    mv ./dist/* ./
    echo 'move file success'
    rm -rf ./dist
    git status
    git add .
    git commit -m ":tada: update website"
    git push origin gh-pages
    if [[ $? == 0 ]];then
      git checkout master
    fi
  else
    echo 'some error of git'
  fi
fi
