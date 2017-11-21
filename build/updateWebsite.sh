read -p "are you sure publish webSite ? do not remember commit code  " -n 1 choose
if [[ $choose =~ ^[Yy]$ ]];then
  echo -n 'checkout gh-pages'
  git checkout gh-pages
  if [[ 0 == $? ]];then
    echo -n 'checkout success'
  fi
fi
