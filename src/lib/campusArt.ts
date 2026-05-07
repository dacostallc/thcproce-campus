/**
 * Dimensões export da arte base do campus (`public/campus/campus*.png`).
 * Ao trocar a imagem, atualiza estes valores para manter hotspots alinhados ao mapa
 * e o enquadramento `object-cover` sem cortes desnecessários quando o ratio coincidir.
 */
export const CAMPUS_ART_WIDTH = 1920;
export const CAMPUS_ART_HEIGHT = 1080;
export const CAMPUS_ART_ASPECT = CAMPUS_ART_WIDTH / CAMPUS_ART_HEIGHT;

/**
 * Enquadramento do `object-fit: cover` no viewport (evita foco no céu/chão e ajuda hotspots).
 * Ajuste ao trocar o PNG ou ao refinar o crop widescreen.
 */
export const CAMPUS_IMAGE_OBJECT_POSITION = "center 41%";
