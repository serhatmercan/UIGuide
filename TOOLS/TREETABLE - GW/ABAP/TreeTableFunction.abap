FUNCTION zqmui_hlp_using_decision_tree.
*"----------------------------------------------------------------------
*"*"Local Interface:
*"  IMPORTING
*"     VALUE(IP_CODEGRUPPE) TYPE  QCODEGRP OPTIONAL
*"     VALUE(IP_PARENT) TYPE  ZQMUI_S_USING_DECISION_TREE-PARENT
*"       OPTIONAL
*"     VALUE(IP_LEVEL) TYPE  ZQMUI_S_USING_DECISION_TREE-LEVEL OPTIONAL
*"  TABLES
*"      ET_USING_DECISION STRUCTURE  ZQMUI_S_USING_DECISION_TREE
*"       OPTIONAL
*"----------------------------------------------------------------------

  CALL METHOD zcl_qmui_sh=>zcl_qmui_sh_usg_dec_tree
    EXPORTING
      ip_codegruppe     = ip_codegruppe
      ip_parent         = ip_parent
      ip_level          = ip_level
    IMPORTING
      et_using_decision = et_using_decision[].

ENDFUNCTION.

  METHOD ZCL_QMUI_SH_USG_DEC_TREE.

    FIELD-SYMBOLS: <fs_using_decision> TYPE zqmui_s_using_decision_tree.

    IF ip_parent IS INITIAL.

      SELECT qpgt~katalogart
             qpgt~codegruppe
             qpgt~codegruppe AS node
             qpgt~kurztext   AS description
        FROM qpgr
        INNER JOIN qpgt ON qpgt~katalogart EQ qpgr~katalogart
                       AND qpgt~codegruppe EQ qpgr~codegruppe
        INTO CORRESPONDING FIELDS OF TABLE et_using_decision
        WHERE qpgr~katalogart EQ '3'
          AND qpgr~codegruppe EQ 'ZQM'
          AND qpgt~sprache    EQ sy-langu.

    ELSE.

      SELECT katalogart
             codegruppe AS parent
             code
             code       AS node
             kurztext   AS description
        FROM qpct
        INTO CORRESPONDING FIELDS OF TABLE et_using_decision
        WHERE katalogart EQ '3'
          AND codegruppe EQ ip_parent
          AND sprache    EQ sy-langu.

    ENDIF.

    LOOP AT et_using_decision ASSIGNING <fs_using_decision>.
      IF <fs_using_decision>-codegruppe IS NOT INITIAL.
        <fs_using_decision>-drill = 'expanded'.
      ELSEIF <fs_using_decision>-code IS NOT INITIAL.
        <fs_using_decision>-drill = 'leaf'.
      ENDIF.
    ENDLOOP.

  ENDMETHOD.