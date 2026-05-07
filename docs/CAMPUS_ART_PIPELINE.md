# Pipeline de arte do campus — múltiplas resoluções

1. **Master** PNG ou TIFF da vista aérea (proporção fixa igual ao layout publicado).

2. **Export still** para web:

   - `public/campus/campus.png` (noite)
   - `public/campus/campus-day.png` (dia)

3. **Formatos densidade** (quando integrar `<picture>` no `CampusMap`):

   - `campus-1200.webp`, `campus-1920.webp`, `campus-2560.webp`
   - Repetir sufixos para `campus-day-*`

   Comando exemplo (ffmpeg ou sharp via script próprio):

   ```bash
   npx sharp-cli -i campus-master.png -o campus-1920.webp resize 1920
   ```

4. **Sprites** animados ou estáticos: ver `public/campus/sprites/README.txt`.

5. PixiJS (`AmbientPixi`) usa apenas partículas; futuros NPCs em WebGL devem ler texturas dessa pasta.
