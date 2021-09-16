CLASS zcl_mpc_ext DEFINITION
  PUBLIC
  INHERITING FROM zcl_mpc
  CREATE PUBLIC .

  PUBLIC SECTION.
  
    TYPES:
      BEGIN OF ts_deep.
        INCLUDE TYPE ts_deepid.
    TYPES:
        Documents  TYPE STANDARD TABLE OF ts_documentdelete WITH DEFAULT KEY,
      END OF ts_deep.