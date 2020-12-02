METHOD usagedecisionset_get_entity.

    DATA: lt_key TYPE /iwbep/t_mgw_tech_pairs,
          ls_key TYPE LINE OF /iwbep/t_mgw_tech_pairs.

    lt_key = io_tech_request_context->get_keys( ).

    READ TABLE lt_key INTO ls_key WITH KEY name = 'INSPLOT'.
    IF sy-subrc EQ 0.
      er_entity-insplot = ls_key-value.
    ENDIF.

ENDMETHOD.