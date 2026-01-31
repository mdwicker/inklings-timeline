```base
views:
  - type: table
    name: Table
    filters:
      and:
        - file.path.startsWith("events/")
    order:
      - status
      - person
      - category
      - title
      - edtf
      - note.note
      - oldsource
      - sourcename
      - file.name
    sort:
      - property: oldsource
        direction: DESC
      - property: source
        direction: DESC
      - property: status
        direction: ASC

```


