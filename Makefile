
JSON_SCHEMAS = $(shell find ./test/samples -type f -name '*.schema.json' -print)
YAML_TARGET_SCHEMAS = $(patsubst %.json, %.yaml, $(JSON_SCHEMAS))

YAML_SCHEMAS = $(shell find ./test/samples -type f -name '*.schema.yaml' -print)
JSON_TARGET_SCHEMAS = $(patsubst %.yaml, %.json, $(YAML_SCHEMAS))

%.json: %.yaml
	yq r $< -j > $@

json: $(JSON_TARGET_SCHEMAS)

.PHONY: clean

clean:
	rm -rf test/doc/src
	rm -rf test/doc/out
	rm -rf test/doc/book
	rm -rf test/doc/book-extrafiles

doc: clean json
	mkdir -p test/doc/src
	mkdir -p test/doc/out
	mkdir -p test/doc/book
	mkdir -p test/doc/book-extrafiles
	jsonschema2md -d test/samples -o test/doc/src -x test/doc/out
	./bin/run gen-summary -s ./test/samples -m ./test/doc/src -a
	mdbook build test/doc
	@cp test/doc/book/*.html test/doc/book-extrafiles
	./bin/run gen-summary -s ./test/samples -m ./test/doc/src
	mdbook build test/doc
	./bin/run fix-sidebar -s ./test/doc/book -d ./test/doc/book-extrafiles
	rsync --ignore-existing test/doc/book-extrafiles/*.html test/doc/book


EXTRA_HTMLFILES:=$(wildcard test/doc/book-extrafiles/*.html)
SIDEBAR_HTML:=$(shell cat test/doc/book/index.html | grep '<ol class="chapter"' | sed 's/\//\\\//g' | sed 's/"/\\"/g' )

# This doesn't work for a clean install, or after make clean has been called separately,
# because the test/doc/book and test/doc/book-extrafiles folders are empty when the makefile is parsed, so these two variables are empty.
# After many attempts at trying to figure out how to evaluate them at execution time it was easier to just do the sidebar update in Typescript.

doc_old_version: clean json
	mkdir -p test/doc/src
	mkdir -p test/doc/out
	mkdir -p test/doc/book
	mkdir -p test/doc/book-extrafiles
	jsonschema2md -d test/samples -o test/doc/src -x test/doc/out
	./bin/run gen-summary -s ./test/samples -m ./test/doc/src -a
	mdbook build test/doc
	@cp test/doc/book/*.html test/doc/book-extrafiles
	./bin/run gen-summary -s ./test/samples -m ./test/doc/src
	mdbook build test/doc
	echo "sidebar: $(SIDEBAR_HTML)"
	for f in $(EXTRA_HTMLFILES); do \
		sed -i '.bak' "s/<ol class=\"chapter\".*/$(SIDEBAR_HTML)/" $${f}; \
	done
	rsync --ignore-existing test/doc/book-extrafiles/*.html test/doc/book

