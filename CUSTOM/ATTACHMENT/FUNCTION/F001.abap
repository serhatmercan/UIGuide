FUNCTION zsm_ui_fnc_001.
*"----------------------------------------------------------------------
*"*"Local Interface:
*"  TABLES
*"      ET_DATA STRUCTURE  ZSM_UI_TBL_001 OPTIONAL
*"----------------------------------------------------------------------

  SELECT *
    FROM zsm_ui_tbl_001
    INTO CORRESPONDING FIELDS OF TABLE et_data.

ENDFUNCTION.