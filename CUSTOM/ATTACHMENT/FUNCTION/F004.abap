FUNCTION zsm_ui_fnc_004.
*"----------------------------------------------------------------------
*"*"Local Interface:
*"  IMPORTING
*"     VALUE(IP_ID) TYPE  ID
*"  TABLES
*"      ET_DATA STRUCTURE  ZSM_UI_STR_001 OPTIONAL
*"----------------------------------------------------------------------

  SELECT *
    FROM zsm_ui_tbl_002
    INTO CORRESPONDING FIELDS OF TABLE et_data
    WHERE id EQ ip_id.

ENDFUNCTION.