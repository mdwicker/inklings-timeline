const rawData = [
    {
        "name": "Tolkien",
        "className": "group tolkien",
        "hasSubgroups": true,
        "contents": [
            {
                "name": "Location",
                "className": "subgroup tolkien location",
                "hasSubgroups": false,
                "contents": [
                    {
                        "content": "Bloemfontein, South Africa",
                        "start": "1892-01-01",
                        "end": "1895-12-31",
                        "type": "range"
                    },
                    {
                        "content": "Birmingham and suburbs",
                        "start": "1896-01-01",
                        "end" : "1911-09-30"
                    },
                    {
                        "content": "Oxford",
                        "start": "1911-10-01",
                        "end": "1915-04-01",
                        "type": "range"
                    },
                    {
                        "content": "Army",
                        "name": "Mostly training around Bedford and Staffordshire",
                        "start": "1915-04-01",
                        "end": "1916-11-08",
                        "type": "range"
                    },
                    {
                        "content": "France",
                        "start": "1916-06-06",
                        "type": "point"
                    },
                    {
                        "content": "Recovery",
                        "name": "Great Haywood, various camps and hospitals",
                        "start": "1916-11-09",
                        "end": "1918-10-31",
                        "type": "range"
                    },
                    {
                        "content": "Oxford",
                        "start": "1918-11-01",
                        "end": "1920-09-01",
                        "type": "range"
                    },
                    {
                        "content": "Leeds",
                        "start": "1920-09-01",
                        "end": "1926-01-07",
                        "type": "range"
                    },
                    {
                        "content": "5 Holly Bank",
                        "start": "1921-03-01",
                        "end": "1921-08-01",
                        "type": "range"
                    },
                    {
                        "content": "11 St Marks Terrace",
                        "start": "1921-08-01",
                        "end": "1924-03-17",
                        "type": "range"
                    },
                    {
                        "content": "2 Darnley Road",
                        "start": "1924-03-17",
                        "end": "1926-01-07",
                        "type": "range"
                    },
                    {
                        "content": "22 Northmoor Road, Oxford",
                        "start": "1926-01-07",
                        "end": "1930-01-14",
                        "type": "range"
                    },
                    {
                        "content": "20 Northmoor Road, Oxford",
                        "start": "1930-01-14",
                        "end": "1947-03-01",
                        "type": "range"
                    },
                    {
                        "content": "3 Manor Road, Oxford",
                        "start": "1947-03-01",
                        "end": "1953-03-30",
                        "type": "range"
                    },
                    {
                        "content": "76 Sandfield Road, Oxford",
                        "start": "1953-03-30",
                        "end": "1968-06-01",
                        "type": "range"
                    },
                    {
                        "content": "19 Lakeside Road, Poole",
                        "start": "1968-06-01",
                        "end": "1972-03-13",
                        "type": "range"
                    },
                    {
                        "content": "21 Merton Street, Oxford",
                        "start": "1972-03-13",
                        "end": "1973-09-02",
                        "type": "range"
                    }
                ]
            },
            {
                "name": "Occupation",
                "className": "subgroup tolkien occupation",
                "hasSubgroups": false,
                "contents": [
                    {
                        "content": "King Edward's School",
                        "start": "1900-01-01",
                        "end": "1901-12-31",
                        "type": "range"
                    },
                    {
                        "content": "St. Phillip's School",
                        "start": "1902-01-01",
                        "end": "1902-11-01",
                        "type": "range"
                    },
                    {
                        "content": "King Edward's School",
                        "start": "1902-11-01",
                        "end": "1911-09-30",
                        "type": "range"
                    },
                    {
                        "content": "Exeter College",
                        "name": "Student",
                        "start": "1911-10-01",
                        "end": "1915-04-01",
                        "type": "range"
                    },
                    {
                        "content": "Army training",
                        "start": "1915-04-01",
                        "end": "1916-06-06",
                        "type": "range"
                    },
                    {
                        "content": "Army service",
                        "start": "1916-06-06",
                        "end": "1916-11-09",
                        "type": "range"
                    },
                    {
                        "content": "Convalescence",
                        "name": "Some garrison duties when able",
                        "start": "1916-11-09",
                        "end": "1919-07-16",
                        "type": "range"
                    },
                    {
                        "content": "O.E.D.",
                        "start": "1919-07-16",
                        "end": "1920-06-30",
                        "type": "range"
                    },
                    {
                        "content": "Leeds University",
                        "name": "Reader in English Language",
                        "start": "1920-10-01",
                        "end": "1925-09-30",
                        "type": "range"
                    },
                    {
                        "content": "Pembroke College",
                        "name": "Rawlinson and Bosworth Professor of Anglo-Saxon",
                        "start": "1925-10-01",
                        "end": "1945-09-30",
                        "type": "range"
                    },
                    {
                        "content": "Merton College",
                        "name": "Merton Professor of English Language and Literature",
                        "start": "1945-10-01",
                        "end": "1959-12-31",
                        "type": "range"
                    },
                    {
                        "content": "Retirement",
                        "start": "1960-01-01",
                        "end": "1973-09-02",
                        "type": "range"
                    }
                ]
            },
            {
                "name": "Life Events",
                "className": "subgroup tolkien life",
                "hasSubgroups": false,
                "contents": [
                    {
                        "content": "Birth of J.R.R. Tolkien",
                        "start": "1892-01-03",
                        "type": "point"
                    },
                    {
                        "content": "Death of Arthur Tolkien",
                        "name": "J.R.R. Tolkien's father",
                        "start": "1896-02-15",
                        "type": "point"
                    },
                    {
                        "content": "Marriage of J.R.R. Tolkien & Edith Bratt",
                        "start": "1916-03-22",
                        "type": "point"
                    },
                    {
                        "content": "Tolkiens convert to Catholicism",
                        "start": "1900-06-01",
                        "type": "point"
                    },
                    {
                        "content": "Death of Mabel Tolkien",
                        "name": "J.R.R. Tolkien's mother",
                        "start": "1904-11-01",
                        "type": "point"
                    },
                    {
                        "content": "Tolkien meets Edith",
                        "start": "1908-01-01",
                        "type": "point"
                    },
                    {
                        "content": "Communication with Edith forbidden",
                        "start": "1910-01-21",
                        "type": "point"
                    },
                    {
                        "content": "T.C.B.S. formed",
                        "start": "1911-07-01",
                        "type": "point"
                    },
                    {
                        "content": "Tolkien visits Switzerland",
                        "start": "1911-08-01",
                        "type": "point"
                    },
                    {
                        "content": "Tolkien writes to Edith",
                        "start": "1913-01-03",
                        "type": "point"
                    },
                    {
                        "content": "Tolkien joins army",
                        "name": "Receives commission in Lancashire Fusiliers",
                        "start": "1915-07-15",
                        "type": "point"
                    },
                    {
                        "content": "Final T.C.B.S. meeting",
                        "start": "1915-09-26",
                        "type": "point"
                    },

                    {
                        "content": "Edith dances in glade",
                        "start": "1917-05-01",
                        "type": "point"
                    },
                    {
                        "content": "John Tolkien born",
                        "start": "1917-11-16",
                        "type": "point"
                    },
                    {
                        "content": "Michael Tolkien born",
                        "start": "1920-10-22",
                        "type": "point"
                    },
                    {
                        "content": "Christopher Tolkien born",
                        "start": "1924-11-21",
                        "type": "point"
                    },
                    {
                        "content": "Priscilla Tolkien born",
                        "start": "1929-06-18",
                        "type": "point"
                    },
                    {
                        "content": "Tolkiens' Mediterranean cruise",
                        "start": "1966-09-14",
                        "end": "1966-10-06",
                        "type": "point"
                    },
                    {
                        "content": "Death of Edith Tolkien",
                        "start": "1971-11-29",
                        "type": "point"
                    },
                    {
                        "content": "Tolkien receives CBE",
                        "start": "1972-01-01",
                        "type": "point"
                    }
                ]
            },
            {
                "name": "Publications",
                "className": "subgroup tolkien publications",
                "hasSubgroups": true,
                "contents": [
                    {
                        "name": "Major",
                        "className": "subgroup tolkien publications",
                        "hasSubgroups": false,
                        "contents": [
                            {
                                "content": "The Hobbit",
                                "start": "1937-09-21",
                                "type": "point"
                            },
                            {
                                "content": "Leaf by Niggle",
                                "start": "1945-01-01",
                                "type": "point"
                            },
                            {
                                "content": "On Fairy Stories",
                                "name": "Essays Presented to Charles Williams",
                                "start": "1947-12-04",
                                "type": "point"
                            },
                            {
                                "content": "Farmer Giles of Ham",
                                "start": "1949-10-20",
                                "type": "point"
                            },
                            {
                                "content": "The Fellowship of the Ring",
                                "start": "1954-07-29",
                                "type": "point"
                            },
                            {
                                "content": "The Two Towers",
                                "start": "1954-11-11",
                                "type": "point"
                            },
                            {
                                "content": "The Return of the King",
                                "start": "1955-10-20",
                                "type": "point"
                            },
                            {
                                "content": "Ace Books Lord of the Rings",
                                "name": "unauthorized",
                                "start": "1965-07-01",
                                "type": "point"
                            },
                            {
                                "content": "Ballantine Books Lord of the Rings",
                                "start": "1965-12-01",
                                "type": "point"
                            },
                            {
                                "content": "Smith of Wooton Major",
                                "start": "1967-11-09",
                                "type": "point"
                            },
                            {
                                "content": "The Silmarillion",
                                "start": "1977-09-15",
                                "type": "point"
                            },
                            {
                                "content": "Unfinished Tales",
                                "start": "1980-10-02",
                                "type": "point"
                            }
                        ]
                    },
                    {
                        "name": "Minor",
                        "className": "subgroup tolkien publications",
                        "hasSubgroups": false,
                        "contents": [
                            {
                                "content": "Goblin Feet",
                                "name": "Oxford Poetry 1915",
                                "start": "1915-12-01",
                                "type": "point"
                            },
                            {
                                "content": "A Middle English Vocabulary",
                                "start": "1922-05-11",
                                "type": "point"
                            },
                            {
                                "content": "Sir Gawain and the Green Knight",
                                "name": "with E.V. Gordon (Clarendon Press)",
                                "start": "1925-04-23",
                                "type": "point"
                            },
                            {
                                "content": "Errantry",
                                "name": "The Oxford Magazine",
                                "start": "1933-11-09",
                                "type": "point"
                            },
                            {
                                "content": "Beowulf: The Monsters and the Critics",
                                "start": "1937-07-01",
                                "type": "point"
                            },
                            {
                                "content": "The Homecoming of Beorhtnoth Beorhthelm's Son",
                                "start": "1953-10-01",
                                "type": "point"
                            },
                            {
                                "content": "Sir Gawain and the Green Knight broadcast on BBC Radio",
                                "start": "1953-12-06",
                                "type": "point"
                            },
                            {
                                "content": "The Adventures of Tom Bombadil",
                                "start": "1962-11-22",
                                "type": "point"
                            },
                            {
                                "content": "English and Welsh",
                                "start": "1963-07-08",
                                "type": "point"
                            },
                            {
                                "content": "Tree and Leaf",
                                "start": "1964-05-28",
                                "type": "point"
                            },
                            {
                                "content": "The Jerusalem Bible",
                                "name": "Jonah by Tolkien",
                                "start": "1966-01-01",
                                "type": "point"
                            },
                            {
                                "content": "LOTR 2ed.",
                                "start": "1966-10-27",
                                "type": "point"
                            },
                            {
                                "content": "The Road Goes Ever On",
                                "start": "1967-10-31",
                                "type": "point"
                            },
                            {
                                "content": "Father Christmas Letters",
                                "start": "1976-09-02",
                                "type": "point"
                            },
                            {
                                "content": "J.R.R. Tolkien: A Biography",
                                "name": "Carpenter",
                                "start": "1977-05-05",
                                "type": "point"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "Lewis",
        "className": "group lewis",
        "hasSubgroups": true,
        "contents": [
            {
                "name": "Location",
                "className": "subgroup lewis location",
                "hasSubgroups": false,
                "contents": [
                    {
                        "content": "The Kilns",
                        "start": "1930-01-01",
                        "end": "1963-11-22",
                        "type": "range"
                    }
                ]
            },
            {
                "name": "Life Events",
                "className": "subgroup lewis life",
                "hasSubgroups": false,
                "contents": [
                    {
                        "content": "Birth of C.S. Lewis",
                        "start": "1898-11-29",
                        "type": "point"
                    },
                    {
                        "content": "Death of C.S. Lewis",
                        "start": "1963-11-22",
                        "type": "point"
                    }
                ]
            }            
        ]
    },
    {
        "name": "Inklings",
        "className": "group inklings",
        "hasSubgroups": false,
        "contents": [
            {
                "content": "Lewis & Barfield's Great War",
                "start": "1922-01-01",
                "end": "1931-12-31",
                "type": "range"
            },
            {
                "content": "Lewis and Tolkien meet",
                "start": "1926-05-11",
                "type": "point"
            }
        ]
    }
]