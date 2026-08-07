package com.senac.escola.controller;

import java.util.List;

public class BoletimItemDTO {
    public String disciplinaNome;
    public List<NotaResumo> notas;
    public double media;
    public String situacao;

    public static class NotaResumo {
        public Integer bimestre;
        public Double valor;

        public NotaResumo(Integer bimestre, Double valor) {
            this.bimestre = bimestre;
            this.valor = valor;
        }
    }
}
