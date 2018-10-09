deploy:
	# python part
	rm -f *.pyc

	# js part
	cd ui && yarn build && cd ..
	gcloud app deploy --project <FILL ME IN>
