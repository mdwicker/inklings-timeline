```base
views:
  - type: table
    name: Table
    filters:
      and:
        - file.path.startsWith("events/")
        - person == "J.R.R. Tolkien"
    order:
      - person
      - category
      - title
	  - status
	  - source
	  - note.note
      - start
      - end
      - description
      - edtf
      - type
      - file.name
    sort:
      - property: source
        direction: ASC

```