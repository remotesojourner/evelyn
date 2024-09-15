if [ -z "${BROWSER}" ]; then
    echo 'set $BROWSER to chrome or firefox'
else
	VERSION=$(jq -r ".version" src/assets/manifest-$BROWSER.json)
    mkdir -p builds/$BROWSER
	cd dist-$BROWSER
	zip -r ../builds/$BROWSER/karamel-$BROWSER-$VERSION.zip ./*
fi

