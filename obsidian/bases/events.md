```base
views:
  - type: table
    name: Table
    filters:
      and:
        - file.path.startsWith("events/")
    order:
      - person
	  - category
	  - name
	  - start
	  - end
	  - description
	  - edtf
	  - source
	  - note
	  - type
	  - file.name
```


