  METHOD get_control_lot_fields.

    DATA: lt_field    TYPE TABLE OF zqmui_clot_field,
          lv_herkunft TYPE qherk.

    FIELD-SYMBOLS: <fs_field> TYPE zqmui_clot_field,
                   <fv_field> TYPE any.

    CALL METHOD zcl_qmui_get_data=>get_herkunft_with_art
      EXPORTING
        ip_art      = ip_art
      IMPORTING
        ep_herkunft = lv_herkunft.

    CASE ip_type.
      WHEN 'RQ'.
        SELECT *
          FROM zqmui_clot_field
          INTO TABLE lt_field
          WHERE werks    EQ ip_werks
            AND herkunft EQ lv_herkunft
            AND required EQ 'X'.
    ENDCASE.

    es_data-werks = ip_werks.
    es_data-art   = ip_art.
    es_data-type  = ip_type.

    LOOP AT lt_field ASSIGNING <fs_field>.
      ASSIGN COMPONENT <fs_field>-fname OF STRUCTURE es_data TO <fv_field>.
      IF sy-subrc EQ 0.
        <fv_field> = abap_true.
      ENDIF.
    ENDLOOP.

  ENDMETHOD.