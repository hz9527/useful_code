read -p "are you sure publish webSite ? do not remember commit code  " -n 1 choose
if [[ $choose =~ ^[Yy]$ ]];then
  echo 'checkout gh-pages'
  npm run build
  git checkout gh-pages
  if [[ 0 == $? ]];then
    echo 'checkout success'
    # 将dist中文件移至根目录
    mv /dist/* ./
  else
    echo 'some error of git'
  fi
fi
