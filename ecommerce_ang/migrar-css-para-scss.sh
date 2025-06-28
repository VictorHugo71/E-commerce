#!/bin/bash

echo "Iniciando migração de .css para .scss em: src/app/components/"

find src/app/components -type f -name "*.component.css" | while read css_file; do
  # Novo nome com .scss
  scss_file="${css_file%.css}.scss"

  # Renomear o arquivo .css para .scss
  mv "$css_file" "$scss_file"
  echo "✔️ Renomeado: $css_file → $scss_file"

  # Arquivo .ts correspondente
  ts_file="${css_file%.css}.ts"
  if [ -f "$ts_file" ]; then
    sed -i 's/\.css/\.scss/g' "$ts_file"
    echo "🔧 Atualizado styleUrls em: $ts_file"
  else
    echo "⚠️ Aviso: $ts_file não encontrado (ignorado)"
  fi
done

echo "✅ Migração concluída com sucesso."
