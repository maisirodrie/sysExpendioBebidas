# Script para modificar TaskFormPageEdit.jsx
# Elimina el campo "Código Organismo" del formulario

$file = "c:\Users\CCPM\Documents\Sistemas\sysExpendioBebidas\sysExpendioBebidas\ExpendioBebidas\src\pages\TaskFormPageEdit.jsx"
$content = Get-Content $file -Raw -Encoding UTF8

# Buscar y reemplazar el bloque de inputs
$oldBlock = @"
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="nroexpediente-correlativo"
                            value={nroExpedienteParts.correlativo || ""}
                            onChange={(e) => handleNroExpedienteChange(e, "correlativo")}
                            className="w-1/3 bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                            placeholder="Correlativo"
                        />
                        <span className="text-black text-3xl my-2">-</span>
                        <input
                            type="text"
                            name="nroexpediente-codigoOrganismo"
                            value={nroExpedienteParts.codigoOrganismo || ""}
                            onChange={(e) => handleNroExpedienteChange(e, "codigoOrganismo")}
                            className="w-1/3 bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                            placeholder="Cod. Organismo"
                        />
                        <span className="text-black text-3xl my-2">/</span>
                        <input
                            type="text"
                            name="nroexpediente-anio"
                            value={nroExpedienteParts.anio || ""}
                            onChange={(e) => handleNroExpedienteChange(e, "anio")}
                            className="w-1/3 bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                            placeholder="Año"
                        />
                    </div>
"@

$newBlock = @"
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="nroexpediente-correlativo"
                            value={nroExpedienteParts.correlativo || ""}
                            onChange={(e) => handleNroExpedienteChange(e, "correlativo")}
                            className="w-1/2 bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                            placeholder="Correlativo"
                        />
                        <span className="text-black text-3xl my-2">/</span>
                        <input
                            type="text"
                            name="nroexpediente-anio"
                            value={nroExpedienteParts.anio || ""}
                            onChange={(e) => handleNroExpedienteChange(e, "anio")}
                            className="w-1/2 bg-gray-100 text-black px-4 py-2 rounded-md my-2"
                            placeholder="Año"
                        />
                    </div>
"@

$content = $content.Replace($oldBlock, $newBlock)
Set-Content $file -Value $content -Encoding UTF8 -NoNewline

Write-Host "Archivo modificado exitosamente"
Write-Host "Ahora solo muestra: Correlativo / Año"
